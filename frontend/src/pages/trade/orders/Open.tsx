import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { ITrades } from '@redux/types/trades';
import Trades from '@redux/actions/trades';
import { timeExpire, minutes_to_string } from '@utils/functions';
import { AiFillDelete, AiOutlinePause, AiOutlineClose } from 'react-icons/ai';

import useOpen from '@hooks/useOpen';

import Spinner from '@components/loading/Spinner';
import Label1 from '@components/labels/Style1';
import Label2 from '@components/labels/Style2';
import Bullets from '@components/labels/Bullets';
import Message from '@components/hover/Message';
import Round from '@components/buttons/Round';
import Button from '@components/buttons/Button';
import Flex from '@components/flex/Style1';
import Line from '@components/line/Style1';
import Container from '@components/containers/Style1';
import Empty from '@components/loading/Empty';

interface IContext {
  trades: ITrades[] | null,
  latest_price: number,
  openValue: string | null,
  onOpenValue: (value: string, change?: boolean) => void,
  onStopTrading: (trade: ITrades) => void,
  onResumeTrading: (trade: ITrades) => void,
  onDeleteTrade: (trade: ITrades) => void,
  onClosePosition: (trade: ITrades) => void,
  cooldown: (setDate: Date, minutes?: number) => boolean,
  profit_loss: (trade: ITrades, current_price: number) => number,
  cost_risk: (position_size: number, latest_price: number, leverage: number) => string
};

const Open = () => {
  
  const dispatch = useAppDispatch();

  const {openValue, onOpenValue} = useOpen({initialState: ""});

  const {trades, latest_price} = useAppSelector(state => state.trades);

  if(!trades || !trades.length) {
    return (<Empty />)
  }

  const onStopTrading = (trade:ITrades) => {
    dispatch(Trades.update({...trade, action: "break"}));
  };
  
  const onResumeTrading = (trade:ITrades) => {
    dispatch(Trades.update({...trade, running: true}));
    onOpenValue(`${trade._id}break`)
  };

  const onDeleteTrade = (trade:ITrades) => {
    if(trade.orderId) dispatch(Trades.update({...trade, action: "delete"}));
    if(!trade.orderId) dispatch(Trades.remove(trade._id));
  };

  const onClosePosition = (trade:ITrades) => {
    dispatch(Trades.update({...trade, action: "manual"}));
  };

  const cooldown = (setDate: Date, minutes=0) => {
    const future = new Date(setDate).getTime() + (minutes * 60 * 1000);
    const isOnCooldown = future >= Date.now();
    return isOnCooldown;
  };

  const profit_loss = (trade: ITrades, current_price: number): number => {
    if(!current_price) return 0;
    if(trade.side === "buy" ) return (current_price - trade.open_price) * trade.position_size;
    if(trade.side === "sell") return (trade.open_price - current_price) * trade.position_size;
    return 0;
  };

  const cost_risk = (position_size: number, latest_price: number, leverage: number): string => {
    return ((position_size * latest_price) / leverage).toFixed(2);
  };

  const context = {
    openValue,
    onOpenValue,
    cost_risk,
    profit_loss,
    cooldown,
    onClosePosition,
    onDeleteTrade,
    onResumeTrading,
    onStopTrading,
    trades,
    latest_price
  };
  
  return (
    <>
      {trades?.map((el) => 
        <Container key={el._id} background="dark">

          <Summary trade={el} context={context} />

          <Line/>

          <Actions trade={el} context={context} />

          {el.orderId &&
            <PositionOpened trade={el} context={context} />
          }

          { !el.orderId && cooldown(el.createdAt, el.range_cooldown_minute) &&
            <Label1 color="light" name="Trade cooldown" value={`${timeExpire(el.createdAt, el.range_cooldown_minute)} minutes`}/>
          }
          
          { (!el.orderId && !cooldown(el.createdAt, el.range_cooldown_minute)) &&
           <PositionClosed trade={el} context={context} />
          }

        </Container>  
      )}
    </>
  )
}

export default Open;

/***************************************************************************************************************************************/

const Summary = ({trade, context}: {trade: ITrades, context: IContext}) => {

  const {onOpenValue, onResumeTrading} = context;

  return (
    <Flex>
      <div>
        <Bullets text={[trade._id.slice(-6).toUpperCase(), trade.market_id, trade.live?"LIVE":"TEST", trade.strategy.toUpperCase()]}/>
        <Label1 name={trade.createdAt.toLocaleString()} color="light" size="0.7rem"/>
      </div>
      <Flex>
        {!trade.running && 
          <Message message='delete'>
            <Round 
              label1={<AiFillDelete/>}
              onClick={() => onOpenValue(`${trade._id}delete`)}  
              color="dark"
            />
          </Message>
        }

        {trade.orderId && 
          <Message message="close">
            <Round 
              label1={<AiOutlineClose/>} 
              onClick={() => onOpenValue(`${trade._id}closeposition`)}
              color="dark"
            />
          </Message>
        }

        <Message message={trade.running ? "running" : "paused"}>
          <Round 
            label1={trade.running ? <Spinner size={14} /> : <AiOutlinePause/>} 
            onClick={() =>  trade.running ? onOpenValue(`${trade._id}break`) : onResumeTrading(trade)}
            color="dark"
          />
        </Message>
      </Flex>
    </Flex>
  )
};

const Actions = ({trade, context}: {trade: ITrades, context: IContext}) => {

  const {openValue, onDeleteTrade, onStopTrading, onClosePosition} = context;

  return (
    <>
      {openValue === `${trade._id}delete` &&
          <div>
            <Label1 name="Open order will be closed and trade will be deleted, history will be kept." color='light'/>
            <Button label1="Delete Trade Script" loading={trade.action === "delete"} onClick={() => onDeleteTrade(trade)} color="red"/>
            <Line />
          </div>
        }
      {trade.running && openValue === `${trade._id}break` &&
        <div>
          <Label1 name="Open order will be closed, trade script will stop running." color='light'/>
          <Button label1="Stop Trading" loading={trade.action === "break"} onClick={() => onStopTrading(trade)} color="main"/>
          <Line />
        </div>
      }
      {trade.orderId && openValue === `${trade._id}closeposition` &&
        <div>
          <Label1 name="Position currently open will be closed." color='light'/>
          <Button label1="Close Position" loading={trade.action === "manual"} onClick={() => onClosePosition(trade)} color="main"/>
          <Line />
        </div>
      }
    </>
  )
}

const PositionOpened = ({trade, context}:{trade: ITrades, context: IContext}) => {

  const {cost_risk, profit_loss, latest_price} = context;

  return (
    <div>
      <Flex>
        <Label2 name="Side" value={trade.side.toUpperCase()} />
        <Label2 name="Position" value={trade.position_size}/>
        <Label2 name="Leverage" value={`${trade.leverage}x`}/>
        <Label2 name="Estimated Cost" value={`$${cost_risk(trade.position_size, trade.open_price, trade.leverage)}`}/>
      </Flex>
      <Line />
      <Flex>
        <Label2 name="PNL" value={profit_loss(trade, latest_price).toFixed(2)} color={profit_loss(trade, latest_price) >= 0 ? "green" : "red"}/>
        <Label2 name="Expire in" value={`${trade.range_time===0?"not set":timeExpire(trade.createdAt, trade.range_time)} minute`}/>
        <Label2 name="Entry Price" value={trade.open_price} />
        <Label2 name="Take Profit" value={trade.open_take_profit.toFixed(5)} />
      </Flex>
      <Flex>
        <Label2 name="" value=""/>
        <Label2 name="" value=""/>
        <Label2 name="Points" value={trade.side === "sell" ? Math.abs(trade.open_long-latest_price).toFixed(5) : Math.abs(latest_price-trade.open_long).toFixed(5)}/>
        <Label2 name="Stop Loss" value={trade.open_stop_loss.toFixed(5)} />
      </Flex>
    </div>
  )
};

const PositionClosed = ({trade, context}: {trade: ITrades, context: IContext}) => {

  const {cost_risk} = context;

  return (
    <div>

      <>
        <Label1 color="light" name="Position Size" value={trade.position_size} />
        <Label1 color="light" name="Leverage" value={`${trade.leverage}x`} />
        <Label1 color="light" name="Estimated Cost" value={`$${cost_risk(trade.position_size, trade.open_long, trade.leverage)}`} />
        <Line />
        <Label1 color="light" name="Expire Timer" value={!trade.range_time ? "..." : `${trade.range_time} minute`} /> 
        <Label1 color="light" name="Cooldown Timer" value={trade.range_cooldown_minute ? `${trade.range_cooldown_minute} minute` : "0 minute"}  /> 
        <Line />
        <Label1 color="light" name="Range Take Profit" value={trade.range_take_profit.toFixed(5)} />
        <Label1 color="light" name="Range Stop Loss"   value={trade.range_stop_loss.toFixed(5)} />
        <Line />
      </>

      {/*********** COUNTER ***********/}
      {trade.strategy === "counter" && 
        <>
          <Label1 color="light" name="Range Long"  value={trade.range_long.toFixed(5)} />
          <Label1 color="light" name="Range Short" value={trade.range_short.toFixed(5)} />
          <Label1 color="light" name="Open Long"   value={trade.open_long.toFixed(5)} />
          <Label1 color="light" name="Open Short"  value={trade.open_short.toFixed(5)} />
        </>
      }
      {trade.strategy === "counter long only" && 
        <> 
          <Label1 color="light" name="Open Long"  value={trade.open_long.toFixed(5)} />
          <Label1 color="light" name="Range Long" value={trade.range_long.toFixed(5)} />
        </>
      }
      {trade.strategy === "counter short only" && 
        <> 
          <Label1 color="light" name="Open Short"  value={trade.open_short.toFixed(5)} />
          <Label1 color="light" name="Range Short" value={trade.range_short.toFixed(5)} />
        </>
      }

      {/*********** TREND ***********/}
      {trade.strategy === "trend" && 
        <>
          <Label1 color="light" name="Open Long"   value={trade.open_long.toFixed(5)} />
          <Label1 color="light" name="Open Short"  value={trade.open_short.toFixed(5)} />
          <Label1 color="light" name="Range Long"  value={trade.range_long.toFixed(5)} />
          <Label1 color="light" name="Range Short" value={trade.range_short.toFixed(5)} />
        </>
      }
      {trade.strategy === "trend long only" && 
        <> 
          <Label1 color="light" name="Open Long"  value={trade.open_long.toFixed(5)} />
          <Label1 color="light" name="Range Long" value={trade.range_long.toFixed(5)} />
        </>
      }
      {trade.strategy === "trend short only" && 
        <> 
          <Label1 color="light" name="Open Short"  value={trade.open_short.toFixed(5)} />
          <Label1 color="light" name="Range Short" value={trade.range_short.toFixed(5)} />
        </>
      }
      
      {/*********** RSI COUNTER ***********/}
      {trade.strategy === "rsi counter" &&
        <>
          <Label1 color="light" name="Period"  value={minutes_to_string(trade.range_period)} />     
          <Label1 color="light" name="Over Bought Rsi"  value={trade.range_over_bought_rsi} />
          <Label1 color="light" name="Over Sold Rsi" value={trade.range_over_sold_rsi} />
        </>
      }   
      {trade.strategy === "rsi counter long only" &&
        <>
          <Label1 color="light" name="Period"  value={minutes_to_string(trade.range_period)} />
          <Label1 color="light" name="Over Bought Rsi"  value={trade.range_over_bought_rsi} />
        </>
      }   
      {trade.strategy === "rsi counter short only" &&
        <>
          <Label1 color="light" name="Period"  value={minutes_to_string(trade.range_period)} />
          <Label1 color="light" name="Over Sold Rsi" value={trade.range_over_sold_rsi} />
        </>
      }   
      {/*********** RSI TREND ***********/}
      {trade.strategy === "rsi trend" &&
        <>
          <Label1 color="light" name="Period"  value={minutes_to_string(trade.range_period)} />
          <Label1 color="light" name="Over Bought Rsi"  value={trade.range_over_bought_rsi} />
          <Label1 color="light" name="Over Sold Rsi" value={trade.range_over_sold_rsi} />
        </>
      }   
      {trade.strategy === "rsi trend long only" &&
        <>
          <Label1 color="light" name="Period"  value={minutes_to_string(trade.range_period)} />
          <Label1 color="light" name="Over Bought Rsi"  value={trade.range_over_bought_rsi} />
        </>
      }   
      {trade.strategy === "rsi trend short only" &&
        <>
          <Label1 color="light" name="Period"  value={minutes_to_string(trade.range_period)} />
          <Label1 color="light" name="Over Sold Rsi" value={trade.range_over_sold_rsi} />
        </>
      }   

      {/*********** STRENGTH ***********/}
      {(trade.strategy === "strength counter" || trade.strategy === "strength trend") &&
        <>
          <Label1 color="light" name="Period" value={minutes_to_string(trade.range_period)} />
          <Label1 color="light" name="High Strength"   value={trade.range_target_high} />
          <Label1 color="light" name="Low Strength"  value={trade.range_target_low} />
        </>
      }

      {/*********** VELOCITY ***********/}
      {(trade.strategy === "velocity counter" || trade.strategy === "velocity trend") &&
        <>
          <Label1 color="light" name="Period" value={minutes_to_string(trade.range_period)} />
          <Label1 color="light" name="Pump Range"  value={trade.range_target_high} />
          <Label1 color="light" name="Dump Range"  value={trade.range_target_low} />
        </>
      }

    </div>
  )
};
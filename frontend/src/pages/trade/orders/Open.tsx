import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { ITrades } from '@redux/types/trades';
import Trades from '@redux/actions/trades';
import { timeExpire, minutes_to_string } from '@utils/functions';
import { AiFillDelete, AiOutlinePause, AiOutlineClose } from 'react-icons/ai';

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
import useOpen from '@hooks/useOpen';

const Open = () => {
  
  const dispatch = useAppDispatch();

  const {openValue, onOpenValue} = useOpen({initialState: ""});

  const {trades, latest_price} = useAppSelector(state => state.trades);

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

  const profit_loss = (trade: ITrades, current_price: number): number => {
    if(!current_price) return 0;
    if(trade.side === "buy" ) return (current_price - trade.open_price) * trade.position_size;
    if(trade.side === "sell") return (trade.open_price - current_price) * trade.position_size;
    return 0;
  };

  const cost_risk = (position_size: number, latest_price: number, leverage: number): string => {
    return ((position_size * latest_price) / leverage).toFixed(2);
  };

  return (
    <>
      {trades?.map((el) => 
        <Container key={el._id} background="dark">

          <Flex>
            <div>
              <Bullets text={[el.market_id, el.live?"LIVE":"TEST", el.strategy.toUpperCase()]}/>
              <Label1 name={el.createdAt.toLocaleString()} color="light" size="0.7rem"/>
            </div>
            <Flex>
              {!el.running && 
                <Message message='delete'>
                  <Round 
                    label1={<AiFillDelete/>}
                    onClick={() => onOpenValue(`${el._id}delete`)}  
                    color="dark"
                  />
                </Message>
              }

              {el.orderId && 
                <Message message="close">
                  <Round 
                    label1={<AiOutlineClose/>} 
                    onClick={() => onOpenValue(`${el._id}closeposition`)}
                    color="dark"
                  />
                </Message>
              }

              <Message message={el.running ? "running" : "paused"}>
                <Round 
                  label1={el.running ? <Spinner size={14} /> : <AiOutlinePause/>} 
                  onClick={() =>  el.running ? onOpenValue(`${el._id}break`) : onResumeTrading(el)}
                  color="dark"
                />
              </Message>
            </Flex>
          </Flex>

          <Line/>

          {openValue === `${el._id}delete` &&
            <div>
              <Label1 name="Open order will be closed and trade will be deleted, history will be kept." color='light'/>
              <Button label1="Delete Trade Script" loading={el.action === "delete"} onClick={() => onDeleteTrade(el)} color="red"/>
              <Line />
            </div>
          }
          {el.running && openValue === `${el._id}break` &&
            <div>
              <Label1 name="Open order will be closed, trade script will stop running." color='light'/>
              <Button label1="Stop Trading" loading={el.action === "break"} onClick={() => onStopTrading(el)} color="main"/>
              <Line />
            </div>
          }
          {el.orderId && openValue === `${el._id}closeposition` &&
            <div>
              <Label1 name="Position currently open will be closed." color='light'/>
              <Button label1="Close Position" loading={el.action === "manual"} onClick={() => onClosePosition(el)} color="main"/>
              <Line />
            </div>
          }

          {el.orderId 
          ? 
            <div>
                <Flex>
                  <Label2 name="Side" value={el.side.toUpperCase()} />
                  <Label2 name="Position" value={el.position_size}/>
                  <Label2 name="Leverage" value={`${el.leverage}x`}/>
                  <Label2 name="Estimated Cost" value={`$${cost_risk(el.position_size, el.open_price, el.leverage)}`}/>
                </Flex>
                <Line />
                <Flex>
                  <Label2 name="PNL" value={profit_loss(el, latest_price).toFixed(2)} color={profit_loss(el, latest_price) >= 0 ? "green" : "red"}/>
                  <Label2 name="Expire in" value={`${el.range_time===0 ?"not set":timeExpire(el.createdAt, el.range_time)} min`}/>
                  <Label2 name="Entry Price" value={el.open_price} />
                  <Label2 name="Take Profit" value={el.open_take_profit.toFixed(5)} />
                </Flex>
                <Flex>
                  <Label2 name="" value=""/>
                  <Label2 name="" value=""/>
                  <Label2 name="Points" value={el.side === "sell" ? Math.abs(el.open_long-latest_price).toFixed(5) : Math.abs(latest_price-el.open_long).toFixed(5)}/>
                  <Label2 name="Stop Loss" value={el.open_stop_loss.toFixed(5)} />
                </Flex>
            </div>
          :
            <div>

              <Flex>
                <Label2 name="Position Size" value={el.position_size}/>
                <Label2 name="Leverage" value={`${el.leverage}x`}/>
                <Label2 name="Estimated Cost" value={`$${cost_risk(el.position_size, el.open_long, el.leverage)}`}/>
              </Flex>

              <Line />

              <Flex>
                <Label2 name="Timer" value={!el.range_time ? "..." : `${el.range_time} min`} /> 
                <Label2 name="Range Take Profit" value={el.range_take_profit.toFixed(5)} />
                <Label2 name="Range Stop Loss"   value={el.range_stop_loss.toFixed(5)} />
              </Flex>

              {el.strategy === "counter" && 
                <>
                  <Flex>
                    <Label2 name="" value="" />
                    <Label2 name="Open Long"   value={el.open_long.toFixed(5)} />
                    <Label2 name="Range Long"  value={el.range_long.toFixed(5)} />
                  </Flex>
                  <Flex> 
                    <Label2 name="" value="" />
                    <Label2 name="Open Short"  value={el.open_short.toFixed(5)} />
                    <Label2 name="Range Short" value={el.range_short.toFixed(5)} />
                  </Flex>
                </>
              }
              {el.strategy === "counter long only" && 
                <Flex> 
                  <Label2 name="Open Long"  value={el.open_long.toFixed(5)} />
                  <Label2 name="Range Long" value={el.range_long.toFixed(5)} />
                </Flex>
              }
              {el.strategy === "counter short only" && 
                <Flex> 
                  <Label2 name="Open Short"  value={el.open_short.toFixed(5)} />
                  <Label2 name="Range Short" value={el.range_short.toFixed(5)} />
                </Flex>
              }

              {el.strategy === "trend" && 
                <>
                  <Flex>
                    <Label2 name="" value="" />
                    <Label2 name="Open Long"   value={el.open_long.toFixed(5)} />
                    <Label2 name="Range Long"  value={el.range_long.toFixed(5)} />
                  </Flex>
                  <Flex> 
                    <Label2 name="" value="" />
                    <Label2 name="Open Short"  value={el.open_short.toFixed(5)} />
                    <Label2 name="Range Short" value={el.range_short.toFixed(5)} />
                  </Flex>
                </>
              }
              {el.strategy === "trend long only" && 
                <Flex> 
                  <Label2 name="" value="" />
                  <Label2 name="Open Long"  value={el.open_long.toFixed(5)} />
                  <Label2 name="Range Long" value={el.range_long.toFixed(5)} />
                </Flex>
              }
              {el.strategy === "trend short only" && 
                <Flex> 
                  <Label2 name="" value="" />
                  <Label2 name="Open Short"  value={el.open_short.toFixed(5)} />
                  <Label2 name="Range Short" value={el.range_short.toFixed(5)} />
                </Flex>
              }

              {el.strategy === "rsi counter" &&
                <Flex>
                  <Label2 name="Period"  value={minutes_to_string(el.range_period)} />     
                  <Label2 name="Over Bought"  value={el.range_over_bought_rsi} />
                  <Label2 name="Over Sold" value={el.range_over_sold_rsi} />
                </Flex>
              }   
              {el.strategy === "rsi counter long only" &&
                <Flex>
                   <Label2 name="" value="" />
                  <Label2 name="Period"  value={minutes_to_string(el.range_period)} />
                  <Label2 name="Over Bought"  value={el.range_over_bought_rsi} />
                </Flex>
              }   
              {el.strategy === "rsi counter short only" &&
                <Flex>
                  <Label2 name="" value="" />
                  <Label2 name="Period"  value={minutes_to_string(el.range_period)} />
                  <Label2 name="Over Sold" value={el.range_over_sold_rsi} />
                </Flex>
              }   

              {el.strategy === "rsi trend" &&
                <Flex>
                  <Label2 name="Period"  value={minutes_to_string(el.range_period)} />
                  <Label2 name="Over Bought"  value={el.range_over_bought_rsi} />
                  <Label2 name="Over Sold" value={el.range_over_sold_rsi} />
                </Flex>
              }   
              {el.strategy === "rsi trend long only" &&
                <Flex>
                  <Label2 name="" value="" />
                  <Label2 name="Period"  value={minutes_to_string(el.range_period)} />
                  <Label2 name="Over Bought"  value={el.range_over_bought_rsi} />
                </Flex>
              }   
              {el.strategy === "rsi trend short only" &&
                <Flex>
                  <Label2 name="" value="" />
                  <Label2 name="Period"  value={minutes_to_string(el.range_period)} />
                  <Label2 name="Over Sold" value={el.range_over_sold_rsi} />
                </Flex>
              }   

              {(el.strategy === "strength counter" || el.strategy === "strength trend") &&
                <Flex>
                  <Label2 name="Period" value={minutes_to_string(el.range_period)} />
                  <Label2 name="High Strength"   value={el.range_target_high} />
                  <Label2 name="Low Strength"  value={el.range_target_low} />
                </Flex>
              }
              
            </div>
          }

        </Container>  
      )}
    </>
  )
}

export default Open
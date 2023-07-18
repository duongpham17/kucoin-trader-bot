import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Orders from '@redux/actions/orders';

import {timeDifference} from '@utils/functions';
import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';

import {AiFillDelete} from 'react-icons/ai';

import Loading from '@components/loading/Spinner';
import Container from '@components/containers/Style1';
import Line from '@components/line/Style1';
import Bullets from '@components/labels/Bullets';
import Label1 from '@components/labels/Style1';
import Label2 from '@components/labels/Style2';
import Label3 from '@components/labels/Style3';
import Pagination from '@components/pagination/Style1';
import Flex from '@components/flex/Style1';
import Select from '@components/options/Style1';
import Square from '@components/buttons/Button';
import Message from '@components/hover/Message';
import Empty from '@components/loading/Empty';

const History = () => {

  const [dispatch, query] = [useAppDispatch(), useQuery()];

  const {openLocal, onOpenLocal} = useOpen({initialState: "live", local: "history-options"});

  const {orders} = useAppSelector(state => state.orders);

  const symbol = query.getQueryValue("symbol");

  useEffect(() => {
    if(!openLocal || openLocal === "live") dispatch(Orders.orders(`market_id=${symbol},live=true`));
    if(openLocal === "test") dispatch(Orders.orders(`market_id=${symbol},live=false`));
  }, [symbol, openLocal, dispatch]);

  const PNL_memo = useMemo(() => {
    if(!orders) return {loss: 0, profit: 0};
    const data = orders.reduce((acc, cur) => {
      if(cur.profit_loss >= 0){
        acc.profit += cur.profit_loss
      } else {
        acc.loss += cur.profit_loss
      }
      return acc;
    }, {loss: 0, profit: 0});
    return data;
  }, [orders]);

  const RATE_memo = useMemo(() => {
    if(!orders) return { percentage: 0, win: 0,lose: 0 };
    const data = orders.reduce((acc, obj) => {
      const calc = obj.profit_loss >= 0 ? "win" : "lose";
      return {...acc, [calc]: acc[calc] + 1};
    }, {
      win: 0,
      lose: 0
    });
    const win_percentage = ((data.win / orders.length) * 100).toFixed(2);
    return {
      percentage: win_percentage === "NaN" ? 0 : win_percentage,
      win: data.win,
      lose: data.lose
    }
  }, [orders]);

  if(!orders || !orders.length) {
    return (<Empty />)
  }

  return ( orders === null ? <Loading center/> :
    <>
      <Flex>
        <Flex>
          <Label2 name="Total" value={!orders.length ? "0" : orders.length}/>
          <Label2 name="Win" value={RATE_memo.win} />
          <Label2 name="Lose" value={RATE_memo.lose} />
          <Label2 name="%" value={RATE_memo.percentage} />
          <Label2 name="Profit" value={PNL_memo.profit.toFixed(2)} color="green"/>
          <Label2 name="Loss" value={PNL_memo.loss.toFixed(2)} color="red"/>
        </Flex>
        <Flex>
          {openLocal === "test" && !!orders.length && 
            <Message message='clear test'>
              <Square label1={<AiFillDelete/>} color='plain' onClick={() => dispatch(Orders.cleartest())} />
            </Message>
          }
          <Select items={["test", "live"]} color="plain" onClick={(e) => onOpenLocal(e.toString(), false)} selected={!openLocal ? "LIVE" : openLocal.toUpperCase()} />
        </Flex>
      </Flex>

      <Pagination data={orders} show={20}>
        {(el) =>                  
          <Container key={el._id} background="dark">
            <Flex>
              <div>
                <Bullets text={[el.market_id, el.live?"LIVE":"TEST", el.strategy.toUpperCase()]} />
                <Label1 name={`${el.closedAt} ( ${timeDifference(el.closedAt, el.createdAt)} )`} color="light" size="0.7rem"/>
              </div>
              <Label3 name={`$${el.profit_loss.toFixed(2)}`} color={el.profit_loss >= 0 ? "green" : "red"} size="1.2rem" />
            </Flex>
            <Line/>
            <Flex>
              <Label2 name="Side" value={el.side.toUpperCase()} />
              <Label2 name="Position" value={el.position_size}/>
              <Label2 name="Leverage" value={`${el.leverage}x`}/>
              <Label2 name="Cost" value={`$${((el.close_price*el.position_size)/el.leverage).toFixed(2)}`}/>
            </Flex>
            <Line/>
            <Flex>
              <Label2 name="Open Price" value={el.open_price}/>
              <Label2 name="Close Price" value={el.close_price}/>
              <Label2 name="" value="" />
              <Label2 name="" value="" />
            </Flex>
          </Container>    
        }
      </Pagination>

    </>
  )
}

export default History
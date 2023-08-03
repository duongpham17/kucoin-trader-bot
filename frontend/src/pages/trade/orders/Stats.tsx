import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';
import {IOrders} from '@redux/types/orders';
import useLoading from '@hooks/useLoading';
import {timeDifference, UK} from '@utils/time';

import Container from '@components/containers/Style1';
import Flex from '@components/flex/Style1';
import Bullets from '@components/labels/Bullets';
import Label2 from '@components/labels/Style2';
import Label3 from '@components/labels/Style3';
import Line from '@components/line/Style1';
import Pagination from '@components/pagination/Style1';
import Button from '@components/buttons/Button';
import Empty from '@components/loading/Empty';

import {AiFillDelete} from 'react-icons/ai';


const OrdersContainer = ({orders}: {orders: IOrders[]}) => {

  const PNL_memo = (orders: IOrders[]) => {
    if(!orders.length || !orders) return {loss: 0, profit: 0};
    const data = orders.reduce((acc, cur) => {
      if(cur.profit_loss >= 0){
        acc.profit += cur.profit_loss
      } else {
        acc.loss += cur.profit_loss
      }
      return acc;
    }, {loss: 0, profit: 0});
    return data;
  };

  const RATE_memo = (orders: IOrders[]) => {
    if(!orders.length || !orders) return { percentage: 0, win: 0,lose: 0 };
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
  };

  const PNL = PNL_memo(orders);

  const RATES = RATE_memo(orders);

  return (
    <div>
      <Line/>

      <Flex>
        <Label2 name="Total" value={orders.length} />
        <Label2 name="Win" value={RATES.win} />
        <Label2 name="Lose" value={RATES.lose}  />
        <Label2 name="%" value={RATES.percentage}  />
        <Label2 name="Profit" value={PNL.profit.toFixed(2)} color="green" />
        <Label2 name="Loss" value={PNL.loss.toFixed(2)} color="red" />
      </Flex>

      <Line/>

      <Pagination data={orders} show={5}>
        {(el) => 
          <Container key={el._id} background="light">
            <Flex> 
              <Label2 name="PNL" value={el.profit_loss.toFixed(2)} color={el.profit_loss > 0 ?"green":"red"}/>
              <Label2 name="SIDE" value={el.side.toUpperCase()}/>
              <Label2 name="OPEN" value={`${el.open_price}`}/>
              <Label2 name="CLOSE" value={`${el.close_price}`}/>
            </Flex>
            <Flex>
              <Label2 name="" value={`${UK(el.createdAt)} (${timeDifference(el.closedAt, el.createdAt)})`} size="0.8rem" color="light"/>
            </Flex>
          </Container>  
        }
      </Pagination>
    </div>
  )
}

const StatsContainer = () => {

  const dispatch = useAppDispatch()

  const {trades, stats} = useAppSelector(state => state.trades);

  const {loading, onLoading} = useLoading();

  if(!trades || !trades.length) {
    return (<Empty />)
  }

  return (
    <div>
      {trades?.map(el => 
        <Container background='dark' key={el._id}>

          <Flex>
            <Bullets text={[el._id.slice(-6).toUpperCase(), el.market_id, el.live?"LIVE":"TEST"]} />
            <Flex>
              <Button 
                label1={<AiFillDelete/>} 
                loading={loading}
                onClick={() => onLoading(() => dispatch(Trades.clear(el._id)))} 
                color="dark"
              />
              <Button 
                label1="calculate" 
                loading={loading}
                onClick={() => onLoading(() => dispatch(Trades.stats(el._id)))} 
                color="dark"
              />
            </Flex>
          </Flex>

          <Flex>
            <Label3 name="" value={el.strategy.toUpperCase()} color="light" size="0.8rem" />
          </Flex>
          
          {stats && stats.find(s => s.trade._id === el._id) &&
            <OrdersContainer orders={stats.find(s => s.trade._id === el._id)?.orders || []} />
          }

        </Container>  
      )}
    </div>
  )
}

export default StatsContainer
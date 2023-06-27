import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';
import useQuery from '@hooks/useQuery';

import Loading from '@components/loading/Spinner';

import Rsi from './Rsi';
import Volume from './Volume';
import Prices from './Prices';
import Time from './Time';

const Chart = () => {

    const [ dispatch, query ] = [useAppDispatch(), useQuery()];

    const { klines, latest_price } = useAppSelector(state => state.trades);

    const filter = query.getQuery().replace("?", "").replaceAll("&", ",");

    useEffect(() => {
      let interval = setInterval(() => dispatch(Trades.klines(filter)), 10000);
      dispatch(Trades.klines(filter));
      return () => clearInterval(interval);
    }, [dispatch, filter]);

    useEffect(() => {
      document.title = `${query.getQueryValue("symbol")} ${latest_price}`;
    }, [latest_price, query]);

    return ( !klines ? <Loading size={50} center/> : 
        <>
          <Time />

          <Prices klines={klines} />

          <Rsi klines={klines} />

          <Volume klines={klines} />
        </>  
    )
}

export default Chart
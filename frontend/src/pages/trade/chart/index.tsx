import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';
import useQuery from '@hooks/useQuery';
import useOpen from '@hooks/useOpen';

import Loading from '@components/loading/Spinner';
import Nav from '@components/navs/Style1';

import Time from './Time';
import Prices from './Prices';
import Strength from './Strength';
import Rsi from './Rsi';
import Volume from './Volume';

const Chart = () => {

    const [ dispatch, query ] = [useAppDispatch(), useQuery()];

    const { klines, latest_price } = useAppSelector(state => state.trades);

    const { openLocal, onOpenLocal } = useOpen({initialState: "rsi", local: "trade-charts"});

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

          <Nav pages={["rsi", "strength", "volume"]} onClick={onOpenLocal} selected={openLocal} />

          {openLocal === "rsi" && <Rsi klines={klines} />}

          {openLocal === "strength" && <Strength klines={klines}/>}

          {openLocal === "volume" && <Volume klines={klines} />}
        </>  
    )
}

export default Chart
import styles from './Trades.module.scss';
import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';

const TradesContainer = () => {

    const dispatch = useAppDispatch();

    const {trades} = useAppSelector(state => state.trades);

    useEffect(() => {
        dispatch(Trades.trades());
    }, [dispatch]);

    const filtered_market_ids = Array.from(new Set(trades?.map(el => el.market_id)));

    return ( trades ?
        <div className={styles.container}>
            <h1>Trading</h1>
            <div className={styles.assets}>
                {filtered_market_ids.map(el => 
                    <Link to={`/trade?symbol=${el}`} key={el}>
                        {el}
                    </Link>    
                )}
            </div>
        </div>
        : 
        <></>
    )
}

export default TradesContainer
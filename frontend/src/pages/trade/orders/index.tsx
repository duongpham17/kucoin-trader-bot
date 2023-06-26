import { useEffect } from 'react';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';

import useQuery from '@hooks/useQuery';
import useOpen from '@hooks/useOpen';

import Nav from '@components/navs/Style1';
import Container from '@components/containers/Style1';

import Open from './Open';
import History from './History';
import Stats from './Stats';

const Order = () => {

    const [dispatch, query] = [useAppDispatch(), useQuery()];

    const {openLocal, onOpenLocal} = useOpen({initialState: "open", local: "trade-options"});

    const symbol = query.getQueryValue("symbol");

    useEffect(() => {
        let interval = setInterval(() => dispatch(Trades.trades(`market_id=${symbol}`)), 5000);
        dispatch(Trades.trades(`market_id=${symbol}`));
        return () => clearInterval(interval);
    }, [dispatch, symbol]);

    return (
        <Container style={{margin: "1rem 0"}}>

            <Nav pages={["open", "history", "stats"]} onClick={onOpenLocal} selected={openLocal} />

            {openLocal === "open" && <Open /> }

            {openLocal === "history" && <History /> }

            {openLocal === "stats" && <Stats /> }
            
        </Container>
    )
}

export default Order
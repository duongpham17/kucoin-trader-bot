import useOpen from '@hooks/useOpen';

import Nav from '@components/navs/Style1';
import Container from '@components/containers/Style1';

import Open from './Open';
import History from './History';

const Order = () => {

    const {openLocal, onOpenLocal} = useOpen({initialState: "open", local: "trade-options"});

    return (
        <Container style={{margin: "1rem 0"}}>

            <Nav pages={["open", "history"]} onClick={onOpenLocal} selected={openLocal} />

            {openLocal === "open" && <Open /> }

            {openLocal === "history" && <History /> }
            
        </Container>
    )
}

export default Order
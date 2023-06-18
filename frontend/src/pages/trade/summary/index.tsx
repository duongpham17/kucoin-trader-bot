import { useAppSelector } from '@redux/hooks/useRedux';
import useQuery from '@hooks/useQuery';
import Container from '@components/containers/Style1';
import Label from '@components/labels/Style1';

const Summary = () => {

    const {getQueryValue} = useQuery();

    const {latest_price} = useAppSelector(state => state.trades);

    return (
        <Container>
            <Label name={getQueryValue("symbol")} value={latest_price} size={24}/>
        </Container>
    )
}

export default Summary
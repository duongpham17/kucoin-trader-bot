import useQuery from '@hooks/useQuery';
import Select from '@components/options/Style1';
import { minuteToString } from '@utils/time';

const Period = () => {

    const query = useQuery();

    const onClick = (value: string | number) => {
        query.setQuery("period", 
            value.toString().includes("hour") ? Number(value.toString().split(" ")[0]) * 60 :
            value.toString().includes("day") ? Number(value.toString().split(" ")[0]) * 60 * 24 :
            value.toString().includes("week") ? Number(value.toString().split(" ")[0]) * 60 * 24 * 7 :
            value.toString().includes("month") ? Number(value.toString().split(" ")[0]) * 60 * 24 * 7 * 28 :
            Number(value.toString().split(" ")[0])
        );
    };

    return ( 
        <Select 
            items={["1 minute", "5 minute", "15 minute", "30 minute", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
            selected={`Period ${minuteToString(Number(query.getQueryValue("period"))) || 1}`} 
            onClick={onClick} 
            color="plain"
        /> 
    )
}

export default Period;
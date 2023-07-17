import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { KLines } from '@redux/types/trades';
import Flex from '@components/flex/Style1';

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div>
          <p>{data.time}</p>
          <Flex><span>O</span> <span>{data.open}</span></Flex>
          <Flex><span>H</span> <span>{data.high}</span></Flex>
          <Flex><span>L</span> <span>{data.low}</span></Flex>
          <Flex><span>C</span> <span>{data.close}</span></Flex>
          <Flex><span>V</span> <span>{data.volume}</span></Flex>
        </div>
      );
    }
    return null;
};

const Prices = ({klines}:{klines: KLines}) => {

  const data: {time: string, open: number, high: number, low: number, close: number, volume: number}[] 
    = klines.map(([time, open, high, low, close, volume]) => ({
      time: new Date(time).toISOString(), 
      open, high, low, close, volume
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
        <XAxis dataKey="time" tickFormatter={(time) => time.split("T").join(" ").split(".").slice(0,1).join(" ")} minTickGap={50} fontSize={12}/>
        <YAxis dataKey="close" tickFormatter={(close) => close.toFixed(4)} domain={["auto", "auto"]} fontSize={12}/>
        <Area dataKey="close" opacity={0.5} stroke="#6042d7" fill="#6042d7"/>
        <Tooltip content={<CustomToolTips payload={data}/>}/>
      </AreaChart>
    </ResponsiveContainer>     
  )
}

export default Prices;
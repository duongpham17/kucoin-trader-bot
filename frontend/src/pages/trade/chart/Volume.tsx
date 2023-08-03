import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { KLines } from '@redux/types/trades';
import { UK } from '@utils/time';

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p>{UK(data.time)}</p>
        <p>Volume {data.volume}</p>
      </div>
    );
  }
  return null;
};

const Volume = ({klines}: {klines: KLines}) => {

  const data: {time: string, volume: number}[] = klines.map(data => ({time: new Date(data[0]).toISOString(), volume: data[5]}));

    return (
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
          <XAxis dataKey="time" tickFormatter={(time) => UK(time)} minTickGap={50} fontSize={12}/>
          <YAxis dataKey="volume" tickFormatter={(el) => el.toFixed(0)} domain={[0, 100]} fontSize={12}/>
          <Area dataKey="volume" opacity={0.5} stroke="#6042d7" fill="#6042d7" />
          <Tooltip content={<CustomToolTips payload={data}/>}/>
        </AreaChart>
      </ResponsiveContainer>
    )
}

export default Volume;
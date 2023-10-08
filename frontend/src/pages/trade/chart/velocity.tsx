import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { KLines } from '@redux/types/trades';
import { UK } from '@utils/time';

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p>{new Date(data.time).toLocaleString('en-US', {timeZone: "Europe/London"})}</p>
        <span>Velocity {data.velocity.toFixed(5)}</span>
      </div>
    );
  }
  return null;
};

const Velocity = ({klines}:{klines: KLines}) => {

  // Measures the velocity of price movements.
  const calc_velocity = () => {
    const velocity = [{time: 0, velocity: 0}];
    for(const [time, open, high, low] of klines){
      velocity.push({
        time: time,
        velocity: ((high - low) / open) * 100
      });
    }
    return velocity;
  };

  const data = calc_velocity();

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
        <XAxis dataKey="time" tickFormatter={(time) => UK(time)} minTickGap={50} fontSize={12} padding={{right: 20}} />
        <YAxis dataKey="velocity" domain={["auto", "auto"]} fontSize={12}/>
        <Area dataKey="velocity" opacity={0.5} stroke="#6042d7" fill="#6042d7"/>
        <Tooltip content={<CustomToolTips payload={data}/>}/>
      </AreaChart>
    </ResponsiveContainer>     
  )
}

export default Velocity;
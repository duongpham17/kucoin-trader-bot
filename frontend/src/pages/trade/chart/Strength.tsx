import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { KLines } from '@redux/types/trades';

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p>{new Date(data.time).toISOString()}</p>
        <span>Strength {data.strength}</span>
      </div>
    );
  }
  return null;
};

const Strength = ({klines}:{klines: KLines}) => {

  // Measures price actions based on future prices
  const calc_strength = () => {
    const wins = [{time: 0, strength: 0}];
    for(const i in klines){
      const index = Number(i);
      if(klines.length === index+1 ) break;
      const [current, future] = [ klines[index][4], klines[index+1][4] ];
      if(current < future) {
        wins.push({
          time: klines[index][0],
          strength: wins[index].strength+1
        })
      } else {
        wins.push({
          time: klines[index][0],
          strength: wins[index].strength-1
        })
      };
    }
    return wins;
  };

  const data = calc_strength();

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
        <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toISOString().split("T").join(" ").split(".").slice(0,1).join(" ")} minTickGap={50} fontSize={12}/>
        <YAxis dataKey="strength" domain={["auto", "auto"]} fontSize={12}/>
        <Area dataKey="strength" opacity={0.5} stroke="#6042d7" fill="#6042d7"/>
        <Tooltip content={<CustomToolTips payload={data}/>}/>
      </AreaChart>
    </ResponsiveContainer>     
  )
}

export default Strength;
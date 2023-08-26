import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { KLines } from '@redux/types/trades';
import { UK } from '@utils/time';
import Label from '@components/labels/Style3';

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p>{UK(data.time)}</p>
        <span>Strength ( {data.strength >= 0 ? "Long" : "Short"} ) {data.strength}</span>
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

  const latest = data.length ? data.slice(-1)[0].strength : 0;

  const label = 
    latest >= 10 ? "Extreme Over Bought" :
    latest >= 5 ? "Over Bought" :
    latest <= -10 ? "Extreme Over Sold" :
    latest <= -5 ? "Over Sold" :
    "standard"

  return (
    <div>
      <Label value="" name={`STRENGTH ${latest} ${label}`} size="1.5rem" style={{padding: "0.5rem 0"}}/>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
          <XAxis dataKey="time" tickFormatter={(time) => UK(time)} minTickGap={50} fontSize={12}/>
          <YAxis dataKey="strength" domain={["auto", "auto"]} fontSize={12}/>
          <Area dataKey="strength" opacity={0.5} stroke="#6042d7" fill="#6042d7"/>
          <Tooltip content={<CustomToolTips payload={data}/>}/>
        </AreaChart>
      </ResponsiveContainer>  
    </div>
  )
}

export default Strength;
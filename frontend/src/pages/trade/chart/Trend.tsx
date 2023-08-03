import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { KLines } from '@redux/types/trades';
import { UK } from '@utils/time';

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p>{UK(data.time)}</p>
        <span>Trend ({data.trend >= 0 ? "Long" : "Short"}) {data.trend}</span>
      </div>
    );
  }
  return null;
};

const Trend = ({klines}:{klines: KLines}) => {

  const calc_trend = () => {
    const values: {time: number, trend: number}[] = [{time: 0, trend: 0}];

    for(const i in klines){
      const index = Number(i)
      const current = klines[index];
      const future = klines[index+1];

      if(klines.length === index+1) break;
      
      if(future[4] >= current[4]){
          if(values[index].trend >= 0){
              values.push({time: current[0], trend: values[index].trend+1});
          } else {
              values.push({time: current[0], trend: 0});
          }
      } else {
          if(values[index].trend <= 0){
              values.push({time: current[0], trend: values[index].trend-1});
          } else {
              values.push({time: current[0], trend: 0});
          }
      };
    }

    return values;
  };

  const data = calc_trend();

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
        <XAxis dataKey="time" tickFormatter={(time) => UK(time)} minTickGap={50} fontSize={12}/>
        <YAxis dataKey="trend" domain={["auto", "auto"]} fontSize={12}/>
        <Area dataKey="trend" opacity={0.5} stroke="#6042d7" fill="#6042d7"/>
        <Tooltip content={<CustomToolTips payload={data}/>}/>
      </AreaChart>
    </ResponsiveContainer>     
  )
}

export default Trend;
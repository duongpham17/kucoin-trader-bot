import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { KLines } from '@redux/types/trades';
import { UK } from '@utils/time';

//klines [time, open, highest, lowest, close, volume]
const calculateRSI = (klines: [number, number, number, number, number, number][], period: number) => {

  let avg_gains = 0;
  let avg_losses = 0

  // Calculate the initial average gain and average loss over the period
  for(let i in klines){
    const index = Number(i);

    if(index === 0) continue;
    if(index >= period) break;
    
    const price_change = klines[index][4] - klines[index-1][4];

    if(price_change > 0){
      avg_gains += price_change
    } else {
      avg_losses += Math.abs(price_change)
    };
  }

  avg_gains /= period;
  avg_losses /= period;

  const RSI = []

  // Calculate RSI for the remaining data
  for (let i = period; i < klines.length; i++) {
    const priceChange = klines[i][4] - klines[i - 1][4];
    let gain = 0;
    let loss = 0;

    if (priceChange > 0) {
      gain = priceChange;
    } else {
      loss = -priceChange;
    }

    avg_gains = (avg_gains * (period - 1) + gain) / period;
    avg_losses = (avg_losses * (period - 1) + loss) / period;

    const relativeStrength = avg_gains / avg_losses;
    const rsi = 100 - (100 / (1 + relativeStrength));

    RSI.push({
      time: klines[i][0],
      rsi: Number(rsi.toPrecision(2))
    });
  }

  return RSI;
}

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p>{UK(data.time)}</p>
        <p>RSI {data.rsi.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const Rsi = ({klines}: {klines: KLines}) => {

  const rsi = calculateRSI(klines, 14);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={rsi} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
        <XAxis dataKey="time" tickFormatter={(time) => UK(time)} minTickGap={50} fontSize={12}/>
        <YAxis dataKey="rsi" tickFormatter={(el) => el.toFixed(0)} domain={[0, 100]} fontSize={12}/>
        <Area dataKey="rsi" opacity={0.5} stroke="#6042d7" fill="#6042d7" />
        <Tooltip content={<CustomToolTips payload={rsi}/>}/>
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default Rsi;
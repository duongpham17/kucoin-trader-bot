import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { KLines } from '@redux/types/trades';

const calculateRSI = (dataSet: [number, number, number, number, number, number][], period=14): {rsi: number, time: string}[] => {
  if(!dataSet.length) return [{rsi: 0, time: ""}];

  const closePrices = dataSet.map(([_, __, ___, ____, close]) => close);
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < closePrices.length; i++) {
    const diff = closePrices[i] - closePrices[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  };

  const average = (numbers: number[]): number => {
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum / numbers.length;
  };

  let [avgGain, avgLoss] = [ average(gains.slice(0, period)), average(losses.slice(0, period)) ];
  const RSI: number[] = [];

  RSI.push(avgGain / avgLoss);

  for (let i = period; i < closePrices.length; i++) {
    const gain = gains[i - 1];
    const loss = losses[i - 1];
    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;
    RSI.push(avgGain / avgLoss);
  };

  return RSI.map((rsValue, index) => ({
    rsi: 100 - (100 / (1 + rsValue)),
    time: new Date(dataSet[index][0]).toISOString()
  }));
};

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
          <p>{data.time}</p>
          <p>RSI {data.rsi.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const Rsi = ({klines}: {klines: KLines}) => {

  const rsi = calculateRSI(klines, 14);

  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={rsi} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
        <XAxis dataKey="time" tickFormatter={(time) => time.split("T").join(" ").split(".").slice(0,1).join(" ")} minTickGap={50} fontSize={12}/>
        <YAxis dataKey="rsi" tickFormatter={(el) => el.toFixed(0)} domain={[0, 100]} fontSize={12}/>
        <Area dataKey="rsi" opacity={0.5} stroke="#6042d7" fill="#6042d7" />
        <Tooltip content={<CustomToolTips payload={rsi}/>}/>
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default Rsi;
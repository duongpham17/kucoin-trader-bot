import { useEffect } from 'react';
import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';
import useQuery from '@hooks/useQuery';

import Loading from '@components/loading/Spinner';
import Flex from '@components/flex/Style1';
import Select from '@components/options/Style1';

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

const calculateDATAS = (dataSet: [number, number, number, number, number, number][]) => {
  const [prices, volumes]: [
    prices: {time: string, open: number, high: number, low: number, close: number, volume: number}[], 
    volume: {time: string, volume: number}[],
  ] = [ [], [] ];
  for(let [time, open, high, low, close, volume] of dataSet){
    prices.push({time: new Date(time).toISOString(), open, high, low, close, volume});
    volumes.push({time: new Date(time).toISOString(), volume: volume});
  };
  return { prices, volumes }
};

const CustomTooltipPRICES = ({ active, payload }: {active?: any, payload: any}) => {
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

const CustomTooltipRSI = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
          <p>{data.time}</p>
          <p>RSI: {data.rsi.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipVOLUME = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p>{data.time}</p>
        <p>Volume {data.volume}</p>
      </div>
    );
  }
  return null;
};

const Chart = () => {

    const [ dispatch, query ] = [useAppDispatch(), useQuery()];

    const { klines, latest_price } = useAppSelector(state => state.trades);

    const filter = query.getQuery().replace("?", "").replaceAll("&", ",");

    useEffect(() => {
      let interval = setInterval(() => dispatch(Trades.klines(filter)), 10000);
      dispatch(Trades.klines(filter));
      return () => clearInterval(interval);
    }, [dispatch, filter]);

    useEffect(() => {
      document.title = `${query.getQueryValue("symbol")} ${latest_price}`;
    }, [latest_price, query]);
    
    const data = calculateDATAS(klines);
    
    const rsi = calculateRSI(klines, 10);

    const onClick = (value: string | number) => {
      query.setQuery("period", 
        value.toString().includes("hour") ? Number(value.toString().split(" ")[0]) * 60 :
        value.toString().includes("day") ? Number(value.toString().split(" ")[0]) * 60 * 24 :
        value.toString().includes("week") ? Number(value.toString().split(" ")[0]) * 60 * 24 * 7 :
        value.toString().includes("month") ? Number(value.toString().split(" ")[0]) * 60 * 24 * 7 * 28 :
        Number(value.toString().split(" ")[0])
      );
  };

    return ( !klines ? <Loading size={50} center/> : 
        <>

            <Select 
              items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
              selected={`Period ${query.getQueryValue("period") || 1}`} 
              onClick={onClick} 
              color="plain"
            />

            <ResponsiveContainer width="99%" height={220}>
                <AreaChart data={data.prices} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
                    <XAxis dataKey="time" tickFormatter={(time) => time.split("T").join(" ").split(".").slice(0,1).join(" ")} minTickGap={50} fontSize={12}/>
                    <YAxis dataKey="close" tickFormatter={(close) => close.toFixed(4)} domain={["auto", "auto"]} fontSize={12}/>
                    <Area dataKey="close" opacity={0.5} stroke="#6042d7" fill="#6042d7"/>
                    <Tooltip content={<CustomTooltipPRICES payload={data.prices}/>}/>
                </AreaChart>
            </ResponsiveContainer>     

            <ResponsiveContainer width="99%" height={120}>
                <AreaChart data={rsi} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
                    <XAxis dataKey="time" tickFormatter={(time) => time.split("T").join(" ").split(".").slice(0,1).join(" ")} minTickGap={50} fontSize={12}/>
                    <YAxis dataKey="rsi" tickFormatter={(el) => el.toFixed(0)} domain={[0, 100]} fontSize={12}/>
                    <Area dataKey="rsi" opacity={0.5} stroke="#6042d7" fill="#6042d7" />
                    <Tooltip content={<CustomTooltipRSI payload={rsi}/>}/>
                </AreaChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="99%" height={120}>
                <AreaChart data={data.volumes} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
                    <XAxis dataKey="time" tickFormatter={(time) => time.split("T").join(" ").split(".").slice(0,1).join(" ")} minTickGap={50} fontSize={12}/>
                    <YAxis dataKey="volume" tickFormatter={(el) => el.toFixed(0)} domain={[0, 100]} fontSize={12}/>
                    <Area dataKey="volume" opacity={0.5} stroke="#6042d7" fill="#6042d7" />
                    <Tooltip content={<CustomTooltipVOLUME payload={data.volumes}/>}/>
                </AreaChart>
            </ResponsiveContainer>

        </>  
    )
}

export default Chart
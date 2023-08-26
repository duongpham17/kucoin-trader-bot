import React from 'react'
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip } from 'recharts';
import { useAppSelector } from '@redux/hooks/useRedux';
import { KLines } from '@redux/types/trades';
import { UK } from '@utils/time';

import Flex from '@components/flex/Style1';
import Label2 from '@components/labels/Style2';
import Label3 from '@components/labels/Style3';
import Container from '@components/containers/Style1';
import Line from '@components/line/Style1';
import Loading from '@components/loading/Spinner';

import { calc_price, calc_volume } from './data';

const PriceCustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div>
          <p>O. {UK(data.open)}</p>
          <p>C. {UK(data.close)}</p>
          <p>P. {data.price}</p>
        </div>
      );
    }
    return null;
};

const VolumeCustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div>
          <p>O. {UK(data.open)}</p>
          <p>C. {UK(data.close)}</p>
          <p>V. {data.volume}</p>
        </div>
      );
    }
    return null;
};

const AnalyticsWrapper = ({klines}: {klines: KLines}) => {

    const price = calc_price(klines);
    const volume = calc_volume(klines);

    return (
        <Container background='dark'>
            <Label3 name="Price" size="1.5rem" />
            <Flex>
                <Label2 name="H / L / AVG" value={`${price.highest} / ${price.lowest} / ${price.avg_price}`} />
                <Label2 name="Trend" value={`${price.trend}% ${price.trend_label}`} />
                <Label2 name="" value={``} />
            </Flex>
            <br/>
            <Label2 name="AVG Interval Price" value={``} />
            <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={price.interval_trend} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
                    <XAxis dataKey="close" tickFormatter={(time) => UK(time)} minTickGap={50} fontSize={12}/>
                    <YAxis dataKey="price" domain={["auto", "auto"]} fontSize={12}/>
                    <Area dataKey="price" opacity={0.5} stroke="#6042d7" fill="#6042d7"/>
                    <Tooltip content={<PriceCustomToolTips payload={price.interval_trend}/>}/>
                </AreaChart>
            </ResponsiveContainer>     
            <Line />

            <Label3 name="Volume" size="1.5rem" />
            <Flex>
                <Label2 name="H / L" value={`${volume.highest} / ${volume.lowest}`} />
                <Label2 name="Divergence" value={`${volume.current} / ${volume.percentage_difference}%`} />
                <Label2 name="" value={``} />
            </Flex>
            <br/>
            <Label2 name="AVG Interval Volume" value={``} />
            <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={volume.interval_trend} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
                    <XAxis dataKey="close" tickFormatter={(time) => UK(time)} minTickGap={50} fontSize={12}/>
                    <YAxis dataKey="volume" fontSize={12}/>
                    <Area dataKey="volume" opacity={0.5} stroke="#6042d7" fill="#6042d7"/>
                    <Tooltip content={<VolumeCustomToolTips payload={volume.interval_trend}/>}/>
                </AreaChart>
            </ResponsiveContainer>
            <Line />
        </Container>
    )
}

const Analytics = () => {

    const { klines } = useAppSelector(state => state.trades);

    if(!klines || !klines.length){
        return <Loading center />
    };

    return (
        <AnalyticsWrapper klines={klines} />
    );
}

export default Analytics
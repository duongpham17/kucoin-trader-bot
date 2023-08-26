import { KLines } from '@redux/types/trades';

export const calc_price = (klines: KLines) => {
    const latest = klines.slice(-1)[0];

    let [highest, lowest, index] = [0, 0, 0];

    let [total_price] = [0];
    
    let lane_tracker = 0
    const interval = 5
    const equal_lanes = (klines.length) / interval;
    const interval_data: number[][] = [];

    klines.forEach(([time, open, high, low, close, volume]) => {
        index++;
        // Find highest price
        if(highest === 0) highest = high;
        if(high > highest) highest = high;
        // Find lowest price
        if(lowest === 0) lowest = low;
        if(low < lowest) lowest = low;

        // Remove last data point from total
        if(index !== klines.length){
            total_price += close
        };

        // Create interval_data
        if ((index % equal_lanes) !== 0) {
            if (!interval_data[lane_tracker]) interval_data[lane_tracker] = [time,0,0]; // Initialize the lane if not exist
            interval_data[lane_tracker][2] += close;
        } else {
            interval_data[lane_tracker][2] += close;
            interval_data[lane_tracker][1] = time;
            lane_tracker++;
        }
    });

    const avg_price = Number((total_price / klines.length).toFixed(5));
    const avg_price_difference = avg_price - latest[4];
    const trend =  Number((((latest[4] - avg_price) / avg_price) * 100).toFixed(2));
    const trend_label = 
        trend >= 8 ? "Extreme Over Bought" :
        trend >= 3  ? "Over Bought" : 
        trend <= -8 ? "Extreme Over Sold" :
        trend <= -3 ? "Over Sold": 
        "normal";

    const interval_trend = interval_data.reverse().map(([open, close, price]) => ({
        price: (price / equal_lanes).toFixed(5),
        open,
        close
    }))

    return {
        highest,
        lowest,
        trend,
        avg_price_difference,
        trend_label,
        avg_price,
        interval_trend
    }
};

export const calc_volume = (klines: KLines) => {

    //const latest_kline = klines.slice(-1)[0];

    let [highest, lowest, current] = [0, 0, klines.slice(-1)[0][5]];

    let lane_tracker = 0
    const interval = 5
    const equal_lanes = (klines.length) / interval;
    const interval_data: number[][] = [];

    let index = 0;    
    klines.forEach(([time, open, high, low, close, volume]) => {
        index++;
        // Find highest volume
        if(highest === 0) highest = volume;
        if(highest < volume) highest = volume;
        // Find lowest volume
        if(lowest === 0) lowest = volume;
        if(volume < lowest) lowest = volume;

        // Create interval_data
        if ((index % equal_lanes) !== 0) {
            if (!interval_data[lane_tracker]) interval_data[lane_tracker] = [time,0,0]; // Initialize the lane if not exist
            interval_data[lane_tracker][2] += volume;
        } else {
            interval_data[lane_tracker][2] += volume;
            interval_data[lane_tracker][1] = time;
            lane_tracker++;
        }
    });

    const percentage_difference = Number(((1 - ((highest - current) / highest)) * 100).toFixed(2));

    const interval_trend = interval_data.reverse().map(([open, close, volume]) => ({
        volume: Math.round(volume / equal_lanes),
        open,
        close
    }))

    return {
        highest,
        lowest,
        current,
        percentage_difference,
        interval_trend
    }
};

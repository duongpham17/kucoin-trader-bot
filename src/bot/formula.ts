import {Klines} from '../@api/kucoin';

// [time, open, high, low, close, volume]
export const calculateRsi = (klines: Klines, period=14) => {

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

export const calculateStrength = (klines: Klines) => {
    const str = [0];
    for(const i in klines){
      const index = Number(i);
      if(klines.length === index+1 ) break;
      const [current, future] = [ klines[index][4], klines[index+1][4] ];
      if(current < future) {
        str.push(str[index]+1)
      } else {
        str.push(str[index]-1)
      };
    }
    return str;
};

export const calculateVelocity = (klines: Klines) => {
    const data = klines.slice(-1)[0];
    const velocity = ((data[2] - data[3]) / data[1]) * 100;
    const direction = data[1] > data[4];
    return {
        velocity,
        direction : direction ? "up" : "down"
    };
};

export const calculateTrend = (klines: Klines) => {
    const values: number[] = [0];

    for(const i in klines){
      const index = Number(i)
      const current = klines[index];
      const future = klines[index+1];

      if(klines.length === index+1) break;
      
      if(future[4] >= current[4]){
          if(values[index] >= 0){
            values.push(values[index]+1);
          } else {
            values.push(0);
          }
      } else {
          if(values[index] <= 0){
            values.push(values[index]-1);
          } else {
            values.push(0);
          }
      };
    }
    return values;
};
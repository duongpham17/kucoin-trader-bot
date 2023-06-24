import {kucoin, Klines} from '../@api/kucoin';
import {generateid} from '../@utils/functions';
import Trades, {ITrades} from '../models/trades';
import Orders from '../models/orders';

export const exchanage_api = async ({trade}: {trade: ITrades}) => {
    const KucoinLive = kucoin({symbol: trade.market_id});
    const price = await KucoinLive.getPrice();
    return {
        KucoinLive,
        price: price ? price : null
    }
};

// [time, open, high, low, close, volume]
export const calculateRSI = (dataSet: [number, number, number, number, number, number][], period=14): {rsi: number}[] => {
    const closePrices = dataSet.map(data => data[4]);
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
  
    return RSI.map((rsValue) => ({
      rsi: 100 - (100 / (1 + rsValue)),
    }));
};

export const strategy_methods = async ({trade, price, KucoinLive}: {trade: ITrades, price: number, KucoinLive: any})  => {
    let [isLong, isShort] = [false, false];
    const {open_short, open_long, strategy} = trade;

    if(strategy === "counter"){
        const long = price <= open_short;
        isLong = long;
        const short = price >= open_long;
        isShort = short;
    };

    if(strategy === "counter long only"){
        const long = price <= open_short;
        isLong = long;
    };

    if(strategy === "counter short only"){
        const short = price >= open_long;
        isShort = short;
    };

    if (strategy === "trend"){
        const long = price >= open_long;
        isLong = long;
        const short = price <= open_short;
        isShort = short;
    };

    if (strategy === "trend long only"){
        const long = price >= open_long;
        isLong = long;
    };

    if (strategy === "trend short only"){
        const short = price <= open_short;
        isShort = short;
    };

    if(strategy === "rsi counter"){
        const klines = await KucoinLive.getKlines(5);
        if(klines) {
            const rsi = calculateRSI(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const long = value <= trade.range_over_sold_rsi;
            isLong = long;
            const short = value >= trade.range_over_bought_rsi;
            isShort = short;
        }
    };

    if(strategy === "rsi counter long only"){
        const klines = await KucoinLive.getKlines(5);
        if(klines) {
            const rsi = calculateRSI(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const long = value <= trade.range_over_sold_rsi;
            isLong = long;
        }
    };

    if(strategy === "rsi counter short only"){
        const klines = await KucoinLive.getKlines(5);
        if(klines) {
            const rsi = calculateRSI(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const short = value >= trade.range_over_bought_rsi;
            isShort = short;
        }
    };

    if(strategy === "rsi trend"){
        const klines: Klines = await KucoinLive.getKlines(5);
        if(klines) {
            const rsi = calculateRSI(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const long = value >= trade.range_over_bought_rsi;
            isLong = long;
            const short = value <= trade.range_over_sold_rsi;
            isShort = short;
        }
    };

    if(strategy === "rsi trend long only"){
        const klines: Klines = await KucoinLive.getKlines(5);
        if(klines) {
            const rsi = calculateRSI(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const long = value >= trade.range_over_bought_rsi;
            isLong = long;
        }
    };

    if(strategy === "rsi trend short only"){
        const klines: Klines = await KucoinLive.getKlines(5);
        if(klines) {
            const rsi = calculateRSI(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const short = value <= trade.range_over_sold_rsi;
            isShort = short;
        }
    };

    if(strategy === "high low counter"){
        const long = price <= open_short;
        isLong = long;
        const short = price >= open_long;
        isShort = short;
    };

    if (strategy === "high low trend"){
        const long = price >= open_long;
        isLong = long;
        const short = price <= open_short;
        isShort = short;
    };

    const isNoSide = !isLong && !isShort;

    const side: "buy" | "sell" = isLong ? "buy" : "sell";

    return { 
        isNoSide,
        isLong,
        isShort,
        side,
    };
};

export const calc_entry_price = async ({trade, price, KucoinLive}: {KucoinLive: any, trade: ITrades, price: number}) => {
    const is_entry_calculated = trade.open_long === 0 && trade.open_short === 0;
    if(is_entry_calculated === false) return false;
    let [open_long, open_short] = [0,0];
    if(trade.strategy.toLowerCase().includes("high low")){
        const klines: Klines = await KucoinLive.getKlines(5);
        open_long = Math.max(...klines.map((data) => data[2]));
        open_short = Math.min(...klines.map((data) => data[3]));
    } else {
        open_long = Number(price + Number(trade.range_long || 0));
        open_short = Number(price - Number(trade.range_short || 0));
    };
    await Trades.findByIdAndUpdate(trade._id, { open_short, open_long }, {new: true});
    return true;
};

export const clean_up_close_position = async ({trade, price}: {trade: ITrades, price: number}) => {
    await Orders.create({
        ...trade.toObject(),
        _id: null,
        close_price: price,
        profit_loss: (trade.side === "buy" ? (price-trade.open_price) : (trade.open_price-price)) * trade.position_size,
        closedAt: new Date(),
    });
    await Trades.findByIdAndUpdate(trade._id, {
        orderId: "",
        side: "",
        open_short: 0,
        open_long: 0,
    }, {new: true});
} 

export const quick_close_position = async ({trade, price, KucoinLive}: {trade: ITrades, price: number, KucoinLive: any }) => {
    if(trade.live){
        const close = await KucoinLive.closePosition(trade.orderId);
        if(!close) return false;
        const position = await KucoinLive.getPosition(close.orderId);
        if(!position) return false;
        await clean_up_close_position({trade, price: position.markPrice || price});
    } else {
        await clean_up_close_position({trade, price});
    };
};

export const close_position = async ({trade, price, KucoinLive}: {trade: ITrades, price: number, KucoinLive: any }) => {
    if(trade.live){
        const position = await KucoinLive.getPosition(trade.orderId);
        if(position.isOpen === false) await clean_up_close_position({trade, price});
    };
    const [
        stop_loss_hit, 
        take_profit_hit,
    ] = [
        trade.side === "buy" ? price <= trade.open_stop_loss : price >= trade.open_stop_loss, 
        trade.side === "buy" ? price >= trade.open_take_profit : price <= trade.open_take_profit,
    ];
    // price has not hit any targets.
    if(!stop_loss_hit && !take_profit_hit) {
        return;
    };
    // profit or loss will close via stop losss.
    if(stop_loss_hit){
        await quick_close_position({trade, price, KucoinLive});
        return;
    };
    //trailing take profit, keep increasing the range of profit taking to match volatility.
    if(take_profit_hit){
        await Trades.findByIdAndUpdate(trade._id, {
            open_stop_loss: trade.side === "buy" ? price - (trade.range_stop_loss/2) : price + (trade.range_stop_loss/2),
            open_take_profit: trade.side === "buy" ? price + trade.range_take_profit : price - trade.range_take_profit
        }, {new: true});
        return;
    };
};

const quick_open_position = async ({trade, price, orderId, side}: {trade: ITrades, price: number, orderId: string, side: "buy" | "sell"}) => {
    await Trades.findByIdAndUpdate(trade._id, {
        orderId,
        side,
        open_price: price,
        open_stop_loss: side === "buy" ? price - trade.range_stop_loss : price + trade.range_stop_loss,
        open_take_profit: side === "buy" ? price + trade.range_take_profit : price - trade.range_take_profit,
        createdAt: new Date()
    }, {new: true});
};

export const open_position = async ({trade, price, side, KucoinLive}: {trade: ITrades, price: number, side: "buy" | "sell", KucoinLive: any}) => {
    if(trade.live){
        const open = await KucoinLive.placePosition({ 
            side: side, 
            leverage: trade.leverage, 
            size: trade.position_size, 
            price: price
        });
        if(!open) {
            await Trades.findByIdAndUpdate(trade._id, {action: "break"}, {new:true});
            return;
        };
        const position = await KucoinLive.getPosition(open.orderId);
        if(!position) {
            await Trades.findByIdAndUpdate(trade._id, {action: "break"}, {new:true});
            return;
        };
        await quick_open_position({
            trade,
            side,
            orderId: position.id,
            price: position.avgEntryPrice, 
        });
    } else {
        await quick_open_position({
            trade, 
            side,
            orderId: `test-order-id-${generateid(3)}`,
            price: price, 
        });
    };
};

// Break - This action will stop trade from running, any trade open will close
export const action_break = async ({trade, price, KucoinLive} : {trade: ITrades, price: number, KucoinLive: any}) => {
    trade.running = false;
    trade.action = "bot";
    if(trade.orderId){
        await quick_close_position({ trade, price, KucoinLive });
    } else {
        await Trades.findByIdAndUpdate(trade._id, trade, {new: true});
    }
};

// Manual - This action will close position, any trade open will close
export const action_manual = async ({trade, price, KucoinLive} : {trade: ITrades, price: number, KucoinLive: any}) => {
    if(trade.orderId){
        trade.action = "manual"
        await quick_close_position({ trade, price, KucoinLive });
    } else {
        trade.action = "bot";
        await Trades.findByIdAndUpdate(trade._id, trade, {new: true});
    }
};

// Delete - This action will delete position, any trade open will close
export const action_delete = async ({trade, price, KucoinLive} : {trade: ITrades, price: number, KucoinLive: any}) => {
    if(trade.orderId){
        trade.action = "delete"
        await quick_close_position({ trade, price, KucoinLive });
    };
    await Trades.findByIdAndDelete(trade._id);
};

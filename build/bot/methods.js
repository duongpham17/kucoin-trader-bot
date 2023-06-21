"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action_delete = exports.action_manual = exports.action_break = exports.open_position = exports.close_position = exports.quick_close_position = exports.clean_up_close_position = exports.calc_entry_price = exports.strategy_methods = exports.calculateRSI = exports.exchanage_api = void 0;
const kucoin_1 = require("../@api/kucoin");
const functions_1 = require("../@utils/functions");
const trades_1 = __importDefault(require("../models/trades"));
const orders_1 = __importDefault(require("../models/orders"));
const exchanage_api = async ({ trade }) => {
    const KucoinLive = (0, kucoin_1.kucoin)({ symbol: trade.market_id });
    const price = await KucoinLive.getPrice();
    return {
        KucoinLive,
        price: price ? price : null
    };
};
exports.exchanage_api = exchanage_api;
const calculateRSI = (dataSet, period = 14) => {
    const closePrices = dataSet.map(data => data[4]);
    const gains = [];
    const losses = [];
    for (let i = 1; i < closePrices.length; i++) {
        const diff = closePrices[i] - closePrices[i - 1];
        gains.push(diff > 0 ? diff : 0);
        losses.push(diff < 0 ? Math.abs(diff) : 0);
    }
    ;
    const average = (numbers) => {
        const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return sum / numbers.length;
    };
    let [avgGain, avgLoss] = [average(gains.slice(0, period)), average(losses.slice(0, period))];
    const RSI = [];
    RSI.push(avgGain / avgLoss);
    for (let i = period; i < closePrices.length; i++) {
        const gain = gains[i - 1];
        const loss = losses[i - 1];
        avgGain = ((avgGain * (period - 1)) + gain) / period;
        avgLoss = ((avgLoss * (period - 1)) + loss) / period;
        RSI.push(avgGain / avgLoss);
    }
    ;
    return RSI.map((rsValue) => ({
        rsi: 100 - (100 / (1 + rsValue)),
    }));
};
exports.calculateRSI = calculateRSI;
const strategy_methods = async ({ trade, price, KucoinLive }) => {
    let [isLong, isShort] = [false, false];
    const { open_short, open_long, strategy } = trade;
    if (strategy === "counter") {
        const long = price <= open_short;
        isLong = long;
        const short = price >= open_long;
        isShort = short;
    }
    ;
    if (strategy === "counter long only") {
        const long = price <= open_short;
        isLong = long;
    }
    ;
    if (strategy === "counter short only") {
        const short = price >= open_long;
        isShort = short;
    }
    ;
    if (strategy === "trend") {
        const long = price >= open_long;
        isLong = long;
        const short = price <= open_short;
        isShort = short;
    }
    ;
    if (strategy === "trend long only") {
        const long = price >= open_long;
        isLong = long;
    }
    ;
    if (strategy === "trend short only") {
        const short = price <= open_short;
        isShort = short;
    }
    ;
    if (strategy === "rsi counter") {
        const klines = await KucoinLive.getKlines(5);
        if (klines) {
            const rsi = (0, exports.calculateRSI)(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const long = value <= trade.range_over_sold_rsi;
            isLong = long;
            const short = value >= trade.range_over_bought_rsi;
            isShort = short;
        }
    }
    ;
    if (strategy === "rsi counter long only") {
        const klines = await KucoinLive.getKlines(5);
        if (klines) {
            const rsi = (0, exports.calculateRSI)(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const long = value <= trade.range_over_sold_rsi;
            isLong = long;
        }
    }
    ;
    if (strategy === "rsi counter long only") {
        const klines = await KucoinLive.getKlines(5);
        if (klines) {
            const rsi = (0, exports.calculateRSI)(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const short = value >= trade.range_over_bought_rsi;
            isShort = short;
        }
    }
    ;
    if (strategy === "rsi trend") {
        const klines = await KucoinLive.getKlines(5);
        if (klines) {
            const rsi = (0, exports.calculateRSI)(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const long = value >= trade.range_over_bought_rsi;
            isLong = long;
            const short = value <= trade.range_over_sold_rsi;
            isShort = short;
        }
    }
    ;
    if (strategy === "rsi trend long only") {
        const klines = await KucoinLive.getKlines(5);
        if (klines) {
            const rsi = (0, exports.calculateRSI)(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const long = value >= trade.range_over_bought_rsi;
            isLong = long;
        }
    }
    ;
    if (strategy === "rsi trend short only") {
        const klines = await KucoinLive.getKlines(5);
        if (klines) {
            const rsi = (0, exports.calculateRSI)(klines.slice(150), trade.range_period_rsi);
            const value = Number(rsi.slice(-1)[0].rsi);
            const short = value <= trade.range_over_sold_rsi;
            isShort = short;
        }
    }
    ;
    const isNoSide = !isLong && !isShort;
    const side = isLong ? "buy" : "sell";
    return {
        isNoSide,
        isLong,
        isShort,
        side,
    };
};
exports.strategy_methods = strategy_methods;
const calc_entry_price = async ({ trade, price, KucoinLive }) => {
    const is_entry_calculated = trade.open_long === 0 && trade.open_short === 0;
    if (is_entry_calculated === false)
        return false;
    const open_long = Number(price + Number(trade.range_long || 0));
    const open_short = Number(price - Number(trade.range_short || 0));
    await trades_1.default.findByIdAndUpdate(trade._id, { open_short, open_long }, { new: true });
    return true;
};
exports.calc_entry_price = calc_entry_price;
const clean_up_close_position = async ({ trade, price }) => {
    await orders_1.default.create({
        ...trade.toObject(),
        _id: null,
        close_price: price,
        profit_loss: (trade.side === "buy" ? (price - trade.open_price) : (trade.open_price - price)) * trade.position_size,
        closedAt: new Date(),
    });
    await trades_1.default.findByIdAndUpdate(trade._id, {
        orderId: "",
        side: "",
        open_short: 0,
        open_long: 0,
    }, { new: true });
};
exports.clean_up_close_position = clean_up_close_position;
const quick_close_position = async ({ trade, price, KucoinLive }) => {
    if (trade.live) {
        const close = await KucoinLive.closePosition(trade.orderId);
        if (!close)
            return false;
        const position = await KucoinLive.getPosition(close.orderId);
        if (!position)
            return false;
        await (0, exports.clean_up_close_position)({ trade, price: position.markPrice || price });
    }
    else {
        await (0, exports.clean_up_close_position)({ trade, price });
    }
    ;
};
exports.quick_close_position = quick_close_position;
const close_position = async ({ trade, price, KucoinLive }) => {
    if (trade.live) {
        const position = await KucoinLive.getPosition(trade.orderId);
        if (position.isOpen === false)
            await (0, exports.clean_up_close_position)({ trade, price });
    }
    ;
    const [stop_loss_hit, take_profit_hit,] = [
        trade.side === "buy" ? price <= trade.open_stop_loss : price >= trade.open_stop_loss,
        trade.side === "buy" ? price >= trade.open_take_profit : price <= trade.open_take_profit,
    ];
    // price has not hit any targets.
    if (!stop_loss_hit && !take_profit_hit) {
        return;
    }
    ;
    // profit or loss will close via stop losss.
    if (stop_loss_hit) {
        await (0, exports.quick_close_position)({ trade, price, KucoinLive });
        return;
    }
    ;
    //trailing take profit, keep increasing the range of profit taking to match volatility.
    if (take_profit_hit) {
        await trades_1.default.findByIdAndUpdate(trade._id, {
            open_stop_loss: trade.side === "buy" ? price - (trade.range_stop_loss / 2) : price + (trade.range_stop_loss / 2),
            open_take_profit: trade.side === "buy" ? price + trade.range_take_profit : price - trade.range_take_profit
        }, { new: true });
        return;
    }
    ;
};
exports.close_position = close_position;
const quick_open_position = async ({ trade, price, orderId, side }) => {
    await trades_1.default.findByIdAndUpdate(trade._id, {
        orderId,
        side,
        open_price: price,
        open_stop_loss: side === "buy" ? price - trade.range_stop_loss : price + trade.range_stop_loss,
        open_take_profit: side === "buy" ? price + trade.range_take_profit : price - trade.range_take_profit,
        createdAt: new Date()
    }, { new: true });
};
const open_position = async ({ trade, price, side, KucoinLive }) => {
    if (trade.live) {
        const open = await KucoinLive.placePosition({
            side: side,
            leverage: trade.leverage,
            size: trade.position_size,
            price: price
        });
        if (!open) {
            await trades_1.default.findByIdAndUpdate(trade._id, { action: "break" }, { new: true });
            return;
        }
        ;
        const position = await KucoinLive.getPosition(open.orderId);
        if (!position) {
            await trades_1.default.findByIdAndUpdate(trade._id, { action: "break" }, { new: true });
            return;
        }
        ;
        await quick_open_position({
            trade,
            side,
            orderId: position.id,
            price: position.avgEntryPrice,
        });
    }
    else {
        await quick_open_position({
            trade,
            side,
            orderId: `test-order-id-${(0, functions_1.generateid)(3)}`,
            price: price,
        });
    }
    ;
};
exports.open_position = open_position;
// Break - This action will stop trade from running, any trade open will close
const action_break = async ({ trade, price, KucoinLive }) => {
    trade.running = false;
    trade.action = "bot";
    if (trade.orderId) {
        await (0, exports.quick_close_position)({ trade, price, KucoinLive });
    }
    else {
        await trades_1.default.findByIdAndUpdate(trade._id, trade, { new: true });
    }
};
exports.action_break = action_break;
// Manual - This action will close position, any trade open will close
const action_manual = async ({ trade, price, KucoinLive }) => {
    if (trade.orderId) {
        trade.action = "manual";
        await (0, exports.quick_close_position)({ trade, price, KucoinLive });
    }
    else {
        trade.action = "bot";
        await trades_1.default.findByIdAndUpdate(trade._id, trade, { new: true });
    }
};
exports.action_manual = action_manual;
// Delete - This action will delete position, any trade open will close
const action_delete = async ({ trade, price, KucoinLive }) => {
    if (trade.orderId) {
        trade.action = "delete";
        await (0, exports.quick_close_position)({ trade, price, KucoinLive });
    }
    ;
    await trades_1.default.findByIdAndDelete(trade._id);
};
exports.action_delete = action_delete;

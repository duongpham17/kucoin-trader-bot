import { Types, Schema, model, Document } from 'mongoose';

export interface ITrades extends Document {
    _id: Types.ObjectId,
    //is trade running on or off
    running: boolean,
    //user interaction to update tasks
    action: "manual" | "bot" | "delete" | "break",
    //trade details
    orderId: string,
    live: boolean,
    exchange: string,
    market_id: string,
    strategy: string,
    leverage: number,
    position_size: number,
    side: "buy" | "sell",
    //for entry targets
    range_period: number,
    range_short: number,
    range_long: number,
    range_over_bought_rsi: number,
    range_over_sold_rsi: number,
    range_target_high: number,
    range_target_low: number
    range_time: number,
    range_cooldown_minute: number,
    //for exit targets
    range_stop_loss: number,
    range_take_profit: number,
    //for opening positions
    open_price: number,
    open_long: number,
    open_short: number,
    open_stop_loss: number,
    open_take_profit: number,
    //date of trade
    closedAt: Date,
    createdAt: Date,
};

const TradesSchema = new Schema<ITrades>({
    running: {
        type: Boolean,
        default: true
    },
    action: {
        type: String,
        enum: ["manual", "bot", "delete", "break"],
        default: "bot"
    },
    //trade details
    orderId: {
        type: String,
        default: "",
    },
    live: {
        type: Boolean,
    },
    exchange: {
        type: String,  
        default: "kucoin"
    },
    market_id: {
        type: String,
        uppercase: true,
    },
    strategy: {
        type: String,
    },
    side: {
        type: String,
        enum: ["buy", "sell"]
    },
    leverage: {
        type: Number,
        default: 1,
    },
    position_size: {
        type: Number,
    },
    open_price: {
        type: Number
    },
    //for entry targets
    range_period: {
        type: Number
    },
    range_short: {
        type: Number,
        default: 0
    },
    range_long: {
        type: Number,
        default: 0
    },
    range_over_bought_rsi: {
        type: Number,
        default: 70
    },
    range_over_sold_rsi: {
        type: Number,
        default: 30
    },
    range_target_high: {
        type: Number
    },
    range_target_low: {
        type: Number
    },
    range_time:{
        type: Number,
    },
    range_cooldown_minute: {
        type: Number
    },
    //for exit targets
    range_stop_loss: {
        type: Number,
        default: 0
    },
    range_take_profit: {
        type: Number,
        default: 0
    },
    //for opening positions
    open_long: {
        type: Number,
        default: 0
    },
    open_short: {
        type: Number,
        default: 0
    },
    open_stop_loss: {
        type: Number,
        default: 0
    },
    open_take_profit: {
        type: Number,
        default: 0
    },
    //date of trade
    createdAt: {
        type: Date,
        default: new Date()
    },
});

export default model<ITrades>('Trades', TradesSchema);
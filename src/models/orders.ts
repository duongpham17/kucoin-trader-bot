import { Types, Schema, model, Document } from 'mongoose';

export interface IOrders extends Partial<Document> {
    _id: Types.ObjectId,
    //
    tradeId: string,
    orderId: string,
    live: boolean,
    strategy: string,
    market_id: string,
    exchange: string,
    action: "manual" | "bot" | "delete" | "break",
    side: "buy" | "sell",
    position_size: number,
    open_price: number,
    close_price: number,
    profit_loss: number,
    leverage: number,
    //
    range_short: number,
    range_long: number,
    range_over_bought_rsi: number,
    range_over_sold_rsi: number,
    range_period_rsi: number,
    range_stop_loss: number,
    range_take_profit: number,
    //
    closedAt: Date,
    createdAt: Date,
};

const OrdersSchema = new Schema<IOrders>({
    live: {
        type: Boolean,
    },
    tradeId:{
        type: String
    },
    orderId: {
        type: String,
    },
    market_id: {
        type: String,
        uppercase: true,
    },
    exchange: {
        type: String,  
    },
    action: {
        type: String,
        enum: ["manual", "bot", "delete", "break"],
        default: "bot"
    },
    side: {
        type: String,
        enum: ["buy", "sell"]
    },
    position_size: {
        type: Number,
    },
    open_price: {
        type: Number,
    },
    close_price: {
        type: Number,
    },
    profit_loss: {
        type: Number,
    },
    leverage: {
        type: Number,
        default: 1,
    },
    strategy: {
        type: String,
    },
    range_short: {
        type: Number
    },
    range_long: {
        type: Number
    },
    range_over_bought_rsi: {
        type: Number
    },
    range_over_sold_rsi: {
        type: Number
    },
    range_period_rsi:{
        type: Number,
    },
    range_stop_loss: {
        type: Number
    },
    range_take_profit: {
        type: Number
    },
    closedAt: {
        type: Date,
        default: new Date()
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
});

export default model<IOrders>('Orders', OrdersSchema);
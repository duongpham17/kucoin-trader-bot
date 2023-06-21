"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const OrdersSchema = new mongoose_1.Schema({
    live: {
        type: Boolean,
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
    range_period_rsi: {
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
exports.default = (0, mongoose_1.model)('Orders', OrdersSchema);

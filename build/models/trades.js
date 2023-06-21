"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const TradesSchema = new mongoose_1.Schema({
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
    range_period_rsi: {
        type: Number,
        default: 10
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
exports.default = (0, mongoose_1.model)('Trades', TradesSchema);

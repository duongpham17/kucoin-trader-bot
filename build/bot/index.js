"use strict";
/*
    This bot will work in the background, you can extract this bot to its own place.
    This bot will not work if the website is asleep or not open.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trades_1 = __importDefault(require("../models/trades"));
const methods_1 = require("./methods");
const bot = () => {
    setInterval(async () => {
        const trades = await trades_1.default.find({ running: true });
        for (let trade of trades) {
            // Get latest price
            const { KucoinLive, price } = await (0, methods_1.exchanage_api)({ trade });
            if (!price)
                continue;
            // ACTIONS - Manual - This action will close position, any trade open will close
            if (trade.action === "manual") {
                await (0, methods_1.action_manual)({ trade, price, KucoinLive });
                continue;
            }
            ;
            // ACTIONS - Break - This action will stop trade from running, any trade open will close
            if (trade.action === "break") {
                await (0, methods_1.action_break)({ trade, price, KucoinLive });
                continue;
            }
            ;
            // ACTIONS - Delete - This action will delete position, any trade open will close
            if (trade.action === "delete") {
                await (0, methods_1.action_delete)({ trade, price, KucoinLive });
                continue;
            }
            ;
            // Not Trading
            if (!trade.orderId) {
                // Calculate entry prices
                const calculated = await (0, methods_1.calc_entry_price)({ KucoinLive, trade, price });
                if (calculated)
                    continue;
                // Check if strategy has hit entry targets
                const { isNoSide, side } = await (0, methods_1.strategy_methods)({ trade, price, KucoinLive });
                if (isNoSide)
                    continue;
                await (0, methods_1.open_position)({ trade, price, side, KucoinLive });
                continue;
            }
            ;
            // Trading
            if (trade.orderId) {
                await (0, methods_1.close_position)({ trade, price, KucoinLive });
            }
            ;
        }
        ;
    }, 5000);
};
exports.default = bot;

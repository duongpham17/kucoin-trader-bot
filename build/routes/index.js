"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = __importDefault(require("./orders"));
const trades_1 = __importDefault(require("./trades"));
const endpoints = (app) => {
    app.use('/api/trades', trades_1.default);
    app.use('/api/orders', orders_1.default);
};
exports.default = endpoints;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.kLines = exports.trades = void 0;
const helper_1 = require("../@utils/helper");
const kucoin_1 = require("../@api/kucoin");
const trades_1 = __importDefault(require("../models/trades"));
exports.trades = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({ [el.split("=")[0]]: el.split("=")[1] })));
    let data;
    if (filter) {
        data = await trades_1.default.find(filter).sort({ createdAt: -1 });
    }
    else {
        data = await trades_1.default.find().sort({ createdAt: -1 });
    }
    if (!data)
        return next(new helper_1.appError("Could not find any trades", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.kLines = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({ [el.split("=")[0]]: el.split("=")[1] })));
    const Kucoin = (0, kucoin_1.kucoin)({ symbol: filter.symbol });
    const klines = await Kucoin.getKlines(Number(filter.period || 1));
    if (!klines)
        return next(new helper_1.appError("Could not get klines", 400));
    return res.status(200).json({
        status: "success",
        data: klines
    });
});
exports.create = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await trades_1.default.create(req.body);
    if (!data)
        return next(new helper_1.appError("Could not create trade", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.update = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await trades_1.default.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!data)
        return next(new helper_1.appError("Could not find any trades", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.remove = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const trade = await trades_1.default.findByIdAndDelete(req.params.id);
    if (!trade)
        return next(new helper_1.appError("Could not find any trades", 400));
    return res.status(200).json({
        status: "success",
        data: trade
    });
});

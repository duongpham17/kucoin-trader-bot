"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleartest = exports.orders = void 0;
const helper_1 = require("../@utils/helper");
const orders_1 = __importDefault(require("../models/orders"));
exports.orders = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({ [el.split("=")[0]]: el.split("=")[1] })));
    const data = await orders_1.default.find(filter).sort({ createdAt: -1 });
    if (!data)
        return next(new helper_1.appError("Could not find any trades", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.cleartest = (0, helper_1.asyncBlock)(async (req, res, next) => {
    await orders_1.default.deleteMany({ live: false });
    return res.status(200).json({
        status: "success",
    });
});

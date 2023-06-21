"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_1 = require("../controllers/orders");
const router = express_1.default.Router();
router.get('/:filter', orders_1.orders);
router.delete('/test', orders_1.cleartest);
exports.default = router;

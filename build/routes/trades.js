"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trades_1 = require("../controllers/trades");
const router = express_1.default.Router();
router.post('/', trades_1.create);
router.patch('/', trades_1.update);
router.get('/:filter', trades_1.trades);
router.get('/klines/:filter', trades_1.kLines);
router.delete('/:id', trades_1.remove);
exports.default = router;

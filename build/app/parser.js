"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const parser = (app, express) => {
    app.use(express.json({ limit: '100kb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
};
exports.default = parser;

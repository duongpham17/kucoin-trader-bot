"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const password = process.env.JWT_SECRET;
const encrypt = (text) => {
    const result = crypto_js_1.default.AES.encrypt(text, password);
    return result.toString();
};
exports.encrypt = encrypt;
const decrypt = (text) => {
    const result = crypto_js_1.default.AES.decrypt(text, password);
    return result.toString(crypto_js_1.default.enc.Utf8);
};
exports.decrypt = decrypt;

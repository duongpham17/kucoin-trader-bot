"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kucoin = void 0;
const kucoin_futures_node_api_1 = __importDefault(require("kucoin-futures-node-api"));
const crypto_1 = __importDefault(require("crypto"));
;
const apiLive = new kucoin_futures_node_api_1.default();
apiLive.init({
    apiKey: process.env.KUCOIN_API_KEY,
    secretKey: process.env.KUCOIN_API_SECRET,
    passphrase: process.env.KUCOIN_API_PASSPHRASE,
    environment: 'live'
});
const kucoin = ({ symbol }) => {
    class Kucoin {
        symbol;
        constructor(symbol) {
            this.symbol = symbol;
        }
        ;
        async getAccountOverview() {
            const account = await apiLive.getAccountOverview();
            return account;
        }
        async getPrice() {
            try {
                const response = await apiLive.getTicker(this.symbol);
                return Number(response.data.price);
            }
            catch (_) {
                return null;
            }
        }
        ;
        async getKlines(granularity) {
            try {
                const klines = await apiLive.getKlines({
                    symbol: this.symbol.toUpperCase(),
                    granularity: granularity,
                });
                return klines.data;
            }
            catch (_) {
                return null;
            }
        }
        async placePosition(position) {
            const params = {
                clientOid: crypto_1.default.randomUUID(),
                type: "market",
                symbol: this.symbol.toUpperCase(),
                leverage: position.leverage,
                side: position.side,
                price: position.price,
                size: Math.trunc(position.size / 10)
            };
            try {
                const r = await apiLive.placeOrder(params);
                return r.data;
            }
            catch (err) {
                return null;
            }
            ;
        }
        ;
        async closePosition(clientOid) {
            const params = {
                clientOid,
                closeOrder: true,
                symbol: this.symbol.toUpperCase(),
                type: "market"
            };
            try {
                const r = await apiLive.placeOrder(params);
                return r.data;
            }
            catch (err) {
                return null;
            }
        }
        ;
        async getPosition() {
            try {
                const r = await apiLive.getPosition({ symbol: this.symbol });
                return r.data;
            }
            catch (_) {
                return null;
            }
            ;
        }
        ;
    }
    return new Kucoin(symbol);
};
exports.kucoin = kucoin;

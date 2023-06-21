"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsPublic = exports.corsPrivate = void 0;
const cors_1 = __importDefault(require("cors"));
const _environment_1 = require("../@environment");
// whitelisted website only
exports.corsPrivate = (() => {
    const productionURL = _environment_1.website_url;
    const developmentURL = _environment_1.development_frontend_url;
    const whitelist = process.env.NODE_ENV === "development" ? developmentURL : productionURL;
    return (0, cors_1.default)({
        origin: whitelist,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept'],
    });
})();
// Public use only
exports.corsPublic = (() => {
    return (0, cors_1.default)({
        origin: "*",
        methods: ['GET'],
    });
})();

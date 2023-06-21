"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = require("../@utils/cors");
const helper_1 = require("../@utils/helper");
const routes_1 = __importDefault(require("../routes"));
const routes = (app) => {
    app.use(cors_1.corsPrivate);
    (0, routes_1.default)(app);
    app.use(helper_1.errorMessage);
};
exports.default = routes;

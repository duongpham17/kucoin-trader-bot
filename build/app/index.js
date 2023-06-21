"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const security_1 = __importDefault(require("./security"));
const parser_1 = __importDefault(require("./parser"));
const port_1 = __importDefault(require("./port"));
const frontend_1 = __importDefault(require("./frontend"));
const route_1 = __importDefault(require("./route"));
const database_1 = __importDefault(require("./database"));
const bot_1 = __importDefault(require("../bot"));
const app = (0, express_1.default)();
exports.default = () => {
    (0, security_1.default)(app);
    (0, parser_1.default)(app, express_1.default);
    (0, route_1.default)(app);
    (0, database_1.default)();
    (0, frontend_1.default)(app, express_1.default);
    (0, bot_1.default)();
    (0, port_1.default)(app);
};

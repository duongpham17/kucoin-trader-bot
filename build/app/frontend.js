"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const frontend = (app, express) => {
    const production = process.env.NODE_ENV === "production";
    if (!production)
        return;
    app.use(express.static(path_1.default.join(__dirname, '../../frontend/build')));
    app.get('*', (req, res) => res.sendFile('index.html', { root: path_1.default.join(__dirname, '../../frontend', 'build') }));
};
exports.default = frontend;

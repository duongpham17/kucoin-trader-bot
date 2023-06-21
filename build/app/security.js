"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const security = (app) => {
    app.use(mongoSanitize());
    app.use(xss());
};
exports.default = security;

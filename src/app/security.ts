import {Express} from 'express';
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const security = (app: Express) => {
    app.use(mongoSanitize());
    app.use(xss());
};

export default security;
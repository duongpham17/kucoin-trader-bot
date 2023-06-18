import {Express} from 'express';

import orders from './orders';
import trades from './trades';

const endpoints = (app: Express) => {
    app.use('/api/trades', trades);
    app.use('/api/orders', orders);
};

export default endpoints
import { combineReducers } from '@reduxjs/toolkit';

import alert from './alert';
import trades from './trades';
import orders from './orders';

const reducers = combineReducers({
    alert,
    trades,
    orders
});

export default reducers;
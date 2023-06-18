import { Dispatch } from 'redux';
import { ACTION, TYPES } from '@redux/types/orders';
import { api } from '@redux/api';

const orders = (filter: string) => async (dispatch: Dispatch<ACTION>) => {
    try{
        const res = await api.get(`/orders/${filter}`);
        dispatch({
            type: TYPES.ORDERS,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const cleartest = () => async (dispatch: Dispatch<ACTION>) => {
    try{
        const res = await api.delete(`/orders/test`);
        dispatch({
            type: TYPES.ORDERS_CLEAR_TEST,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
        console.log(error.response)
    }
};

const Orders = {
    orders,
    cleartest
};

export default Orders;
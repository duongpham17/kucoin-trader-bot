import { Dispatch } from 'redux';
import { ACTION, TYPES, ITrades } from '@redux/types/trades';
import { api } from '@redux/api';

const klines = (filter: string) => async (dispatch: Dispatch<ACTION>) => {
    try{
        const res = await api.get(`/trades/klines/${filter}`);
        dispatch({
            type: TYPES.TRADES_KLINES,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const trades = (filter?: string) => async (dispatch: Dispatch<ACTION>) => {
    try{
        const res = await api.get(`/trades/${filter}`);
        dispatch({
            type: TYPES.TRADES,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const create = (data: Partial<ITrades>) => async (dispatch: Dispatch<ACTION>) => {
    try{
        const res = await api.post(`/trades`, data);
        dispatch({
            type: TYPES.TRADES_CREATE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const update = (data: ITrades) => async (dispatch: Dispatch<ACTION>) => {
    try{
        const res = await api.patch(`/trades`, data);
        dispatch({
            type: TYPES.TRADES_UPDATE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const remove = (id: string) => async (dispatch: Dispatch<ACTION>) => {
    try{
        const res = await api.delete(`/trades/${id}`);
        dispatch({
            type: TYPES.TRADES_DELETE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const Trades = {
    trades,
    klines,
    create,
    update,
    remove
};

export default Trades;
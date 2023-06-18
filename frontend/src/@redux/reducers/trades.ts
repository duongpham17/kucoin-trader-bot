import { ACTION, TYPES, INITIALSTATE } from '@redux/types/trades';

const initialState: INITIALSTATE = {
    trades: null,
    klines: [],
    latest_price: 0
};

export const reducer = (state = initialState, action: ACTION) => {
    const {type, payload} = action;

    switch(type){
    
        case TYPES.TRADES_KLINES:
            return{
                ...state,
                klines: payload,
                latest_price: payload.slice(-1)[0][4]
            };
        case TYPES.TRADES:
            return{
                ...state,
                trades: payload
            };
        case TYPES.TRADES_CREATE:
            return{
                ...state,
                trades: state.trades ? [payload, ...state.trades] : [payload]
            };
        case TYPES.TRADES_UPDATE:
            return{
                ...state,
                trades: state.trades ? state.trades.map(el => el._id === payload._id ? payload : el) : [payload]
            };
        case TYPES.TRADES_DELETE:
            return{
                ...state,
                trades: !state.trades ? [] : state.trades.filter(el => el._id !== payload._id)
            };
        
        default: 
            return state;
    }
}

export default reducer;
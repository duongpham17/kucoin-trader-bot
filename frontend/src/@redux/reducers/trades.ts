import { ACTION, TYPES, INITIALSTATE } from '@redux/types/trades';

const initialState: INITIALSTATE = {
    trades: null,
    klines: [],
    latest_price: 0,
    stats: null,
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
        case TYPES.TRADES_STATS:
            return{
                ...state,
                stats: state.stats ? state.stats.findIndex(el => el.trade._id === payload.trade._id) ===-1 ? [payload, ...state.stats] : state.stats.map(el => el.trade._id === payload.trade._id ? payload : el) : [payload], 
            };
        case TYPES.TRADES_DELETE:
            return{
                ...state,
                trades: !state.trades ? [] : state.trades.filter(el => el._id !== payload._id)
            };
        case TYPES.TRADES_CLEAR:
            return{
                ...state,
                stats: state.stats ? state.stats.filter(el => el.trade._id !== payload) : []
            }
        
        default: 
            return state;
    }
}

export default reducer;
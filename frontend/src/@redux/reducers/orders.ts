import { ACTION, TYPES, INITIALSTATE } from '@redux/types/orders';

const initialState: INITIALSTATE = {
    orders: null,
};

export const reducer = (state = initialState, action: ACTION) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.ORDERS:
            return{
                ...state,
                orders: payload
            };
        case TYPES.ORDERS_CLEAR_TEST:
            return{
                ...state,
                orders: []
            }
        default: 
            return state;
    }
}

export default reducer;
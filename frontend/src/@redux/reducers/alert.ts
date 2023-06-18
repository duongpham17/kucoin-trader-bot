import { TYPES_ALERT, ACTION_ALERT, INITIALSTATE_ALERT } from '@redux/types/alert';

const initialState: INITIALSTATE_ALERT = {
    alert: []
};

export const reducer = (state = initialState, action: ACTION_ALERT) => {
    const {type, payload} = action;

    switch(type){
        case TYPES_ALERT.ALERT_SET:
            return{
                ...state,
                alert: [...state.alert, payload]
            };
        case TYPES_ALERT.ALERT_REMOVE:
            return{
                ...state,
                alert: state.alert.filter(el => el.id !== payload)
            };

        default: 
            return state;
    }
}

export default reducer;
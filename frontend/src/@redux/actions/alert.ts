import { Dispatch } from 'redux';
import { ACTION_ALERT, TYPES_ALERT, IAlert } from '@redux/types/alert';
import { generateid } from '@utils/functions';

const set = (message: string, color: IAlert["color"] = "normal", timeout = 2000) => async (dispatch: Dispatch<ACTION_ALERT>) => {
    const id = generateid();
    dispatch({
        type: TYPES_ALERT.ALERT_SET,
        payload: {
            message, 
            id,
            color
        }
    })
    setTimeout(() => 
        dispatch({
            type: TYPES_ALERT.ALERT_REMOVE,
            payload: id
        })
    , timeout);
};

const remove = (id: string) => async (dispatch: Dispatch<ACTION_ALERT>) => {
    dispatch({
        type: TYPES_ALERT.ALERT_REMOVE,
        payload: id
    })
};

const AlertFunctions = {
    set,
    remove
}

export default AlertFunctions;
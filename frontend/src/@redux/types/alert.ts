/*TYPES**************************************************************************************************************/

export interface IAlert {
    message: string,
    id: string,
    color: "normal" | "red" | "green"
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE_ALERT {
    alert: IAlert[]
};

/*ACTION**************************************************************************************************************/

export enum TYPES_ALERT {
    ALERT_SET = "ALERT_SET",
    ALERT_REMOVE = "ALERT_REMOVE",
};

interface Set {
    type: TYPES_ALERT.ALERT_SET,
    payload: IAlert
};

interface Remove {
    type: TYPES_ALERT.ALERT_REMOVE,
    payload: string
};

export type ACTION_ALERT = Set | Remove;

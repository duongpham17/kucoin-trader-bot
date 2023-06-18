/*TYPES**************************************************************************************************************/

export interface IOrders {
    _id: string,
    live: boolean,
    orderId: string,
    market_id: string,
    exchange: string,
    running: boolean,
    action: "manual" | "bot" | "delete" | "break",
    side: "buy" | "sell",
    position_size: number,
    open_price: number,
    close_price: number,
    profit_loss: number,
    leverage: number,
    strategy: string,
    range_long: number,
    range_short: number,
    range_over_bought_rsi: number,
    range_over_sold_rsi: number,
    range_period_rsi: number,
    range_stop_loss: number,
    range_take_profit: number,
    closedAt: Date,
    createdAt: Date,
};

/*STATE**************************************************************************************************************/

export interface ResponseType {
    [key: string]: string
};

export interface INITIALSTATE {
    orders: IOrders[] | null,
};

export type OrdersObjectKeys = keyof INITIALSTATE

/*ACTION**************************************************************************************************************/

export enum TYPES {
    ORDERS = "ORDERS",
    ORDERS_CLEAR_TEST = "ORDERS_CLEAR_TEST"
};

interface ORDERS {
    type: TYPES.ORDERS,
    payload: IOrders[]
};

interface CLEAR_TEST {
    type: TYPES.ORDERS_CLEAR_TEST,
    payload: null
};

export type ACTION = ORDERS | CLEAR_TEST
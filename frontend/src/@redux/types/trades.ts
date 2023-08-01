import {IOrders} from './orders';

/*TYPES**************************************************************************************************************/

export interface ITrades {
    _id: string,
    //is trade running on or off
    running: boolean,
    //user interaction to update tasks
    action: "manual" | "bot" | "delete" | "break",
    //trade details
    orderId: string,
    live: boolean,
    exchange: string,
    market_id: string,
    strategy: string,
    leverage: number,
    position_size: number,
    side: "buy" | "sell",
    //for entry targets
    range_short: number,
    range_long: number,
    range_over_bought_rsi: number,
    range_over_sold_rsi: number,
    range_target_high: number,
    range_target_low: number
    range_period: number,
    range_time: number,
    range_cooldown_minute: number,
    //for exit targets
    range_stop_loss: number,
    range_take_profit: number,
    //for opening positions
    open_price: number,
    open_long: number,
    open_short: number,
    open_stop_loss: number,
    open_take_profit: number,
    //date of trade
    closedAt: Date,
    createdAt: Date,
};

export type KLines = [number, number, number, number, number, number][];

export type Stats = {trade: ITrades, orders: IOrders[]};

/*STATE**************************************************************************************************************/

export interface ResponseType {
    [key: string]: string
};

export interface INITIALSTATE {
    trades: ITrades[] | null,
    klines: KLines | [],
    stats: Stats[] | null,
    latest_price: number,
};

export type TradesObjectKeys = keyof INITIALSTATE

/*ACTION**************************************************************************************************************/

export enum TYPES {
    TRADES = "TRADES",
    TRADES_STATS = "TRADES_STATS",
    TRADES_UPDATE = "TRADES_UPDATE",
    TRADES_KLINES = "KLINES",
    TRADES_CREATE = "TRADES_CREATE",
    TRADES_DELETE = "TRADES_DELETE",
    TRADES_CLEAR = "TRADES_CLEAR"
};

interface TRADES {
    type: TYPES.TRADES,
    payload: ITrades[]
};

interface KLINES {
    type: TYPES.TRADES_KLINES,
    payload: KLines
};

interface CREATE {
    type: TYPES.TRADES_CREATE,
    payload: ITrades
};

interface UPDATE {
    type: TYPES.TRADES_UPDATE,
    payload: ITrades
};

interface DELETE {
    type: TYPES.TRADES_DELETE,
    payload: ITrades
};

interface STATS {
    type: TYPES.TRADES_STATS,
    payload: Stats
};

interface CLEAR {
    type: TYPES.TRADES_CLEAR,
    payload: string
}

export type ACTION = TRADES | KLINES | CREATE | UPDATE | DELETE | STATS | CLEAR
import {TradingStrategy} from '@data/strategies'
const check = (key: any, values: any) => key in values;

export interface Validation {
    strategy: TradingStrategy | "*",
    leverage: string | number,
    position_size: string | number,
    //for entry targets
    range_short: string | number,
    range_long: string | number,
    range_over_bought_rsi: string | number,
    range_over_sold_rsi: string | number,
    range_target_low: string | number,
    range_target_high: string | number,
    //for exit targets
    range_stop_loss: string | number,
    range_take_profit: string | number,
};

const validations = (values: Validation) => {
    let errors: Partial<Validation> = {};

    if(check("strategy", values)){
        if(!values.strategy) {
            errors.strategy = "*";
        }
    } 
    if(check("leverage", values)){
        if(!values.leverage) {
            errors.leverage = "*";
        } else if(values.leverage > 30){
            errors.leverage = "1 - 30"
        } else if(values.leverage <= 0){
            errors.leverage = "1 - 30"
        }
    } 
    if(check("position_size", values)){
        if(!values.position_size) {
            errors.position_size = "*";
        }
    } 
    if(check("range_stop_loss", values)){
        if(!values.range_stop_loss) {
            errors.range_stop_loss = "*";
        }
    } 
    if(check("range_take_profit", values)){
        if(!values.range_take_profit) {
            errors.range_take_profit = "*";
        }
    } 

    if(values.strategy.includes("rsi")) {
        if(values.range_over_bought_rsi > 100 || values.range_over_bought_rsi <= 50){
            errors.range_over_bought_rsi = "50 - 100";
        } 
        if(values.range_over_sold_rsi <= 0 || values.range_over_sold_rsi >= 50){
            errors.range_over_sold_rsi = "1 - 50";
        } 
    }

    if(
        values.strategy === "velocity trend" || values.strategy === "velocity counter" ||
        values.strategy === "strength counter" || values.strategy === "strength trend"
    ){
        if(values.range_target_high === 0){
            errors.range_target_high = "*";
        } 
        if(values.range_target_low === 0){
            errors.range_target_low = "*";
        } 
    }

    return errors
}

export default validations
import Trades from '../models/trades';

import {
    action_break, 
    action_delete, 
    action_manual, 
    calc_entry_price, 
    exchanage_api,
    strategy_methods, 
    open_position, 
    close_position
} from './methods';

const bot = () => {
    setInterval(async () => {

        const trades = await Trades.find({running: true});

        for(let trade of trades){

            // Get latest price
            const {KucoinLive, price} = await exchanage_api({trade});
            if(!price) continue;

            // ACTIONS - Manual - This action will close position, any trade open will close
            if(trade.action === "manual"){
                await action_manual({trade, price, KucoinLive})
                continue;
            };
            // ACTIONS - Break - This action will stop trade from running, any trade open will close
            if(trade.action === "break"){
                await action_break({trade, price, KucoinLive});
                continue;
            };
            // ACTIONS - Delete - This action will delete position, any trade open will close
            if(trade.action === "delete"){
                await action_delete({trade, price, KucoinLive});
                continue;
            };

            // Not Trading
            if(!trade.orderId) {
                // Calculate entry prices
                const calculated = await calc_entry_price({KucoinLive, trade, price});
                if(calculated) continue;
                // Check if strategy has hit entry targets
                const {isNoSide, side} = await strategy_methods({trade, price, KucoinLive});
                if(isNoSide) continue;

                await open_position({trade, price, side, KucoinLive});
                continue;
            };
            
            // Trading
            if(trade.orderId){
                await close_position({trade, price, KucoinLive});
            };
        
        };

    }, 5000);
};

export default bot;
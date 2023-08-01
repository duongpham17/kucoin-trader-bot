/* 
    This bot will work in the background, you can extract this bot to its own place. 
    This bot will not work if the website is asleep or not open.
*/

import Trades from '../models/trades';

import {
    cooldown,
    action_break, 
    action_delete, 
    action_manual, 
    calc_entry_price, 
    exchanage_api,
    strategy_methods, 
    open_position, 
    close_position,
} from './methods';

async function bot() {
    while (true) {
      console.log(new Date())

      try {

        // Fetch active trades from the database
        const trades = await Trades.find({ running: true });

        // Terminal
        let [live, test] = [0, 0]
        trades.forEach(el => el.live ? live+=1 : test+=1);
        console.log(`Running ${trades.length} - Live ${live} - Test ${test}`)
        console.log("\n")
        
        console.time("Loop")
        let index = 0
        for (const trade of trades) {
          index++;
          console.log(`${index}. ${trade._id.toString()} (${trade.orderId ? "OPEN" : ""})`);

          // Get latest price and other data from the exchange API
          const { KucoinLive, price } = await exchanage_api({ trade });
          if (!price) continue;
  
          // ACTIONS - Manual - This action will close position, any trade open will close
          if (trade.action === "manual") {
            await action_manual({ trade, price, KucoinLive });
            continue;
          };
  
          // ACTIONS - Break - This action will stop trade from running, any trade open will close
          if (trade.action === "break") {
            await action_break({ trade, price, KucoinLive });
            continue;
          };
  
          // ACTIONS - Delete - This action will delete position, any trade open will close
          if (trade.action === "delete") {
            await action_delete({ trade, price, KucoinLive });
            continue;
          };
  
          // On Cooldown
          // const isOnCooldown = cooldown(trade);
          // if (isOnCooldown) continue;
  
          // Not Trading
          if (!trade.orderId) {
            // Calculate entry prices
            const calculated = await calc_entry_price({ KucoinLive, trade, price });
            if (calculated) continue;
  
            // Check if strategy has hit entry targets
            const { isNoSide, side } = await strategy_methods({ trade, price, KucoinLive });
            if (isNoSide) continue;
  
            // Open a new position
            await open_position({ trade, price, side, KucoinLive });
            continue;
          };
  
          // Trading
          if (trade.orderId) {
            // Close the existing position
            await close_position({ trade, price, KucoinLive });
          };
        }
        console.log("\n")
        console.timeEnd("Loop")
      } catch (error) {
        // Handle errors gracefully, log them, or take appropriate actions
        console.error("Error occurred:", error);
      } finally {
        // Add a delay between each loop iteration (adjust the time as needed)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      console.log(`----------------------------------------------------------`)
    }
}
  
export default bot;
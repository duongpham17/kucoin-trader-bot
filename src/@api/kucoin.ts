import kucoin_api from 'kucoin-futures-node-api';
import crypto from 'crypto';

export interface Position {
  side: "buy" | "sell",
  price: number,
  leverage: number,
  size: number,
};

export type Klines = [number, number, number, number, number, number][];

const apiLive = new kucoin_api();

apiLive.init({
  apiKey: process.env.KUCOIN_API_KEY,
  secretKey: process.env.KUCOIN_API_SECRET,
  passphrase: process.env.KUCOIN_API_PASSPHRASE,
  environment: 'live'
});

export const kucoin = ({symbol}: {symbol: string}) => {

  class Kucoin {
    symbol: string;
   
    constructor(symbol: string) {
      this.symbol = symbol;
    };
  
    async getAccountOverview():Promise<any>{
      const account = await apiLive.getAccountOverview();
      return account;
    }
  
    async getPrice(): Promise<number | null> {
      try{
        const response = await apiLive.getTicker(this.symbol);
        return Number(response.data.price);
      } catch(_){
        return null
      }
    };

    async getKlines(granularity: number): Promise<Klines| null>{
      try{
        const klines = await apiLive.getKlines({
          symbol: this.symbol.toUpperCase(),
          granularity: granularity,
        });
        return klines.data
      } catch(_){
        return null
      }
    }
  
    async placePosition(position: Position): Promise<any> {
      const params = {  
        clientOid: crypto.randomUUID(),
        type: "market",
        symbol: this.symbol.toUpperCase(),
        leverage: position.leverage,
        side: position.side,
        price: position.price,
        size: Math.trunc(position.size / 10)
      };
      try{
        const r = await apiLive.placeOrder(params);
        return r.data;
      } catch(err: any){
        return null;
      };
    };
    
    async closePosition(clientOid: string): Promise<any>{
      const params = {
        clientOid,
        closeOrder: true,
        symbol: this.symbol.toUpperCase(),
        type: "market"
      }
      try{
        const r = await apiLive.placeOrder(params);
        return r.data;
      } catch(err: any){
        return null;
      }
    };
  
    async getPosition(): Promise<any>{
      try{
        const r = await apiLive.getPosition({symbol: this.symbol});
        return r.data;
      } catch(_){
        return null;
      };
    };
  }

  return new Kucoin(symbol);
  
}

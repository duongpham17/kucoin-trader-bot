import { NextFunction, Response, Request } from 'express';
import { appError, asyncBlock } from '../@utils/helper';
import { kucoin } from '../@api/kucoin';
import Trades from '../models/trades';
import Orders from '../models/orders';

export const trades = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {
    
    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({[el.split("=")[0]]: el.split("=")[1]})));

    let data: any;

    if(filter){
        data = await Trades.find(filter).sort({createdAt: -1});
    } else {
        data = await Trades.find().sort({createdAt: -1});
    }

    if(!data) return next(new appError("Could not find any trades", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const kLines = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const filter: {symbol: string, period: number} = Object.assign({}, ...req.params.filter.split(",").map(el => ({[el.split("=")[0]]: el.split("=")[1]})));

    const Kucoin = kucoin({symbol: filter.symbol});

    const klines = await Kucoin.getKlines(Number(filter.period || 1));

    if(!klines) return next(new appError("Could not get klines", 400));

    return res.status(200).json({
        status: "success",
        data: klines
    });
  
});

export const create = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Trades.create(req.body);

    if(!data) return next(new appError("Could not create trade", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const update = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Trades.findByIdAndUpdate(req.body._id, req.body, {new: true});

    if(!data) return next(new appError("Could not find any trades", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});


export const remove = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const trade = await Trades.findByIdAndDelete(req.params.id);

    if(!trade) return next(new appError("Could not find any trades", 400));

    return res.status(200).json({
        status: "success",
        data: trade
    });
  
});

export const stats = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const tradeId = req.params.id;

    const trade = await Trades.findById(tradeId);

    if(!trade) return next(new appError("Could not find any trades", 400));

    const orders = await Orders.find({tradeId}).sort({createdAt: -1});

    if(!orders) return next(new appError("Could not find any orders matching trade id", 400));

    return res.status(200).json({
        status: "success",
        data: {
            trade,
            orders,
        }
    });
  
});

export const clearTrade = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    await Orders.deleteMany({tradeId: req.params.id});

    return res.status(200).json({
        status: "success",
    });
  
});
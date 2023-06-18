import { NextFunction, Response, Request } from 'express';
import { asyncBlock, appError } from '../@utils/helper';
import Orders from '../models/orders';

export const orders = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({[el.split("=")[0]]: el.split("=")[1]})))

    const data = await Orders.find(filter).sort({createdAt: -1});

    if(!data) return next(new appError("Could not find any trades", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const cleartest = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    await Orders.deleteMany({live: false});

    return res.status(200).json({
        status: "success",
    });
  
});
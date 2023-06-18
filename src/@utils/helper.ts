import { Request, Response, NextFunction } from 'express';

export const asyncBlock = (fn: CallableFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export class appError extends Error {
    statusCode: number;
    status: string;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.toString().startsWith("4") ? "Fail" : "Error";
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorMessage  = ((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'; 

    res.status(err.statusCode).json({
        status: err.status, 
        message: err.message,
        stack: err.stack,
        error: err
    })
})
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessage = exports.appError = exports.asyncBlock = void 0;
const asyncBlock = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.asyncBlock = asyncBlock;
class appError extends Error {
    statusCode;
    status;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.toString().startsWith("4") ? "Fail" : "Error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.appError = appError;
exports.errorMessage = ((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
});

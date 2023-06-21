"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeExpired = exports.isObjectEmpty = exports.generateid = exports.randomid = exports.secondTillZero = void 0;
const secondTillZero = (minute) => {
    const current_hours_in_milliseconds = Number(Date.now().toString().slice(-10));
    const mod = current_hours_in_milliseconds % (60000 * minute);
    const convert_to_seconds = mod / 1000;
    const convert_to_seconds_till_0 = (minute * 60) - Math.trunc(convert_to_seconds);
    return convert_to_seconds_till_0;
};
exports.secondTillZero = secondTillZero;
const randomid = () => {
    const id = Math.random().toString(36).substring(7);
    return id;
};
exports.randomid = randomid;
const generateid = (times = 2) => {
    const id = Array.from({ length: times }, () => (0, exports.randomid)()).join("");
    return id;
};
exports.generateid = generateid;
const isObjectEmpty = (order) => {
    const is_empty = JSON.stringify(order) === '{}';
    return is_empty;
};
exports.isObjectEmpty = isObjectEmpty;
const timeExpired = (iso, minutes) => {
    const isExpired = Date.now() >= (new Date(iso).getTime() + (minutes * 60 * 1000));
    return isExpired;
};
exports.timeExpired = timeExpired;

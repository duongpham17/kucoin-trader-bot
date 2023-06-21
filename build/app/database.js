"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database = () => {
    try {
        const database = process.env.DATABASE;
        const development = process.env.NODE_ENV === "development";
        const database_password = process.env.DATABASE_PASSWORD;
        const db = database.replace('<password>', database_password);
        mongoose_1.default.set('strictQuery', true);
        mongoose_1.default.connect(db);
        if (development)
            console.log("DB connection successful!");
    }
    catch (err) {
        console.log("Could not connect to database");
    }
};
exports.default = database;

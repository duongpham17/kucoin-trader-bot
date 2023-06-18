import axios from 'axios';

const url = process.env.NODE_ENV === "production" ? "" : "http://localhost:8000";

export const api = axios.create({
    baseURL: `${url}/api`,
    headers: { 
        "Content-Type": "application/json",
    },
});
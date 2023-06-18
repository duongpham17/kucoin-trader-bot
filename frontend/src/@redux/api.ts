import axios from 'axios';

const url = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PRODUCTION_PORT_API : process.env.REACT_APP_DEVELOPMENT_PORT_API;

export const api = axios.create({
    baseURL: `${url}/api`,
    headers: { 
        "Content-Type": "application/json",
    },
});
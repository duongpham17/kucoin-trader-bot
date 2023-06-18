import cors from 'cors';
import { website_url, development_frontend_url } from '../@environment';

// whitelisted website only
export const corsPrivate = (() => {

    const productionURL: string[] = website_url;

    const developmentURL: string[] = development_frontend_url;

    const whitelist: string[] = process.env.NODE_ENV === "development" ? developmentURL : productionURL;

    return cors({
        origin: whitelist,
        methods: ['GET','POST','DELETE','PUT','PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept'],
    });
})();

// Public use only
export const corsPublic = (() => {
    return cors({
        origin: "*",
        methods: ['GET'],
    });
})();
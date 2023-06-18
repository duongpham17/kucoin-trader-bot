import {Express} from 'express';
import {corsPrivate} from '../@utils/cors';
import {errorMessage} from '../@utils/helper';
import endpoints from '../routes';

const routes = (app: Express) => {

    app.use(corsPrivate);

    endpoints(app);

    app.use(errorMessage);
};

export default routes;
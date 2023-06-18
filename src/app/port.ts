import {Express} from 'express';

const port = (app: Express): void => {

    const port = process.env.PORT || 8000;
    
    const development = process.env.NODE_ENV === "development";

    const environment = () => development && console.log(`Listening on port ${port}`);

    app.listen(port, environment);

}

export default port
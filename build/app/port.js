"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const port = (app) => {
    const port = process.env.PORT || 8000;
    const development = process.env.NODE_ENV === "development";
    const environment = () => development && console.log(`Listening on port ${port}`);
    app.listen(port, environment);
};
exports.default = port;

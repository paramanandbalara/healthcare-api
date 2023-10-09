const express = require('express');

const bootstrap = require('./setup/bootstrap');
const app = express();
bootstrap(app).then(() => {
    setupApp(app);
});

// function setupApp(app) {
function setupApp() {
    // app.use(routes);
    // app.use(ApiErrorHandler.handle);
}

module.exports = app;

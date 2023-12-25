const express = require('express');

const bootstrap = require('./setup/bootstrap');
const app = express();
const routes = require('./routes');

app.use(routes);

bootstrap(app).then(() => {
    setupApp();
});

function setupApp() {
    // ... any middleware and routes you want to add later
}

module.exports = app;

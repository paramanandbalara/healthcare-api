const express = require('express');

const bootstrap = require('./setup/bootstrap');
const app = express();
const routes = require('./routes/index');

bootstrap(app)
.then(() => {
    setupApp();
});

function setupApp() {
    app.use(express.json());
    app.use(routes);
    // ... any middleware and routes you want to add later
}

module.exports = app;

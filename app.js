const express = require('express');

const bootstrap = require('./setup/bootstrap');
const app = express();
bootstrap(app).then(() => {
    setupApp();
});

function setupApp() {
    // ... any middleware and routes you want to add later
}

module.exports = app;

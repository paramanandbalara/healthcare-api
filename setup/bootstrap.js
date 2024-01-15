'use strict';

const log = require('morgan');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const initializeLogger = require('./logger');
const initDB = require('./db');

module.exports = async (app) => {
    initializeLogger();
    await initDB(process.env.NODE_ENV);
    const corsConfig = {
        origin: true,
        credentials: true,
        exposedHeaders: ['accesstoken', 'otptoken'],
    };

    app.use(cors(corsConfig));
    app.options('*', cors(corsConfig));

    app.use(log('dev'));

    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

    app.use(express.static(path.join(__dirname, 'public')));
};

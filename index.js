'use strict';
// const gracefulShutDownCalled = false;

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Commenting below for now till better handling for unhandledRejection/uncaughtException is written
// process.on('uncaughtException', handleUncaughtException);
// process.on('unhandledRejection', handleUnhandledRejection);

const app = require('./app');
const serve = require('./setup/server');

const httpServer = serve(app, onServerClosed);

async function gracefulShutdown(signal = null) {
    signal !== null && console.log(`Received ${signal}.`);
    console.log('Gracefully shutting down');
    try {
        httpServer.close();
    } catch (err) {
        console.error(`Error in closing httpServer ${err}`);
        try {
            await onServerClosed();
        } catch (err) {
            console.error(`onServerClosed err ${err}`);
            process.exit(-1);
        }
    }
}

async function onServerClosed() {
    console.log('HTTP server closed.');

    const closeConnections = async (connection) => {
        return connection.end().catch((err) => connection.destroy(err));
    };

    try {
        await closeConnections(readDb);
    } catch (err) {
        console.error(`Error closing readDb ${err}`);
    }

    try {
        await closeConnections(writeDb);
    } catch (err) {
        console.error(`Error closing writeDb ${err}`);
    }

    process.exit(0);
}

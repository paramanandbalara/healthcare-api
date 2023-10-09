'use strict';

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

const app = require('./app');
const { server, io } = require('./setup/server')(app, onServerClosed);

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('send_message', (data) => {
        console.log('Received message', data);
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

async function gracefulShutdown(signal = null) {
    signal !== null && console.log(`Received ${signal}.`);
    console.log('Gracefully shutting down');
    try {
        server.close();
    } catch (err) {
        console.error(`Error in closing server ${err}`);
        await onServerClosed();
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

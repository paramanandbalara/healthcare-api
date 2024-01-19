'use strict';

const http = require('http');
const socketIo = require('socket.io');

module.exports = function createHttpServer(app, onServerClose) {
    if (typeof onServerClose !== 'function') {
        throw new Error('onServerClose must be a function');
    }

    const port = normalizePort(process.env.PORT || '3001');
    console.log('Available port : ',port)
    app.set('port', port);

    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    server.on('close', onServerClose);

    const io = socketIo(server, {
        cors: {
            origin: "*",  // Allow any origin to access. Adjust this for security reasons.
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    return { server, io };

    function normalizePort(val) {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
            return val; // Named pipe
        }
        if (port >= 0) {
            return port; // Port number
        }
        return false; // Invalid port value
    }

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
        switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
        }
    }

    function onListening() {
        const addr = server.address();
        const bind =
			typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    }
};

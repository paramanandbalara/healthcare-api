'use strict';

const http = require('http');

/**
 * Export a function that creates an HTTP server.
 *
 * @param {Express.Application} app - The Express application.
 * @param {Function} onServerClose - A callback function to handle server close events.
 * @returns {http.Server} - The created HTTP server.
 */
module.exports = function createHttpServer(app, onServerClose) {
    // Check if onServerClose is a function, throw an error if not
    if (typeof onServerClose !== 'function') {
        throw new Error('onServerClose must be a function');
    }

    // Normalize the port by parsing it as an integer or returning false if invalid
    const port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    // Create an HTTP server using the Express app
    const server = http.createServer(app);

    // Listen on the specified port
    server.listen(port);

    // Event listener for server errors
    server.on('error', onError);

    // Event listener for server listening
    server.on('listening', onListening);

    // Event listener for server close
    server.on('close', onServerClose);

    /**
	 * Normalize a port into a number, string, or false.
	 *
	 * @param {string} val - The port value to normalize.
	 * @returns {number|string|false} - The normalized port value.
	 */
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

    /**
	 * Event listener for HTTP server "error" event.
	 *
	 * @param {Error} error - The error object.
	 */
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

    /**
	 * Event listener for HTTP server "listening" event.
	 */
    function onListening() {
        const addr = server.address();
        const bind =
			typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    }

    return server;
};

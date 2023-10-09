const winston = require('winston');

module.exports = function initializeLogger(){
    // Create a Winston logger instance
    const logger = winston.createLogger({
        level: 'info', // Adjust the log level as needed
        format: winston.format.simple(),
        transports: [
            new winston.transports.Console()
            // You can add other transports like file, HTTP, etc. as needed
        ]
    });

    global.logger = logger;
};



'use strict';

const mysql = require('mysql2');

module.exports = async function configureDatabaseConnections(env) {
    // Create a function to create a MySQL connection pool with promises
    const createDbPool = (config) => mysql.createPool(config).promise();

    // Configure database credentials for writing
    const writeDbCredentials = {
        host: process.env.dbHost,
        user: process.env.dbUser,
        password: process.env.dbPassword,
        database: process.env.dbName,
        waitForConnections: true,
        connectionLimit: env === 'production' ? 2 : 1,
        queueLimit: 0
    };

    // Create a connection pool for writing
    const writeDb = createDbPool(writeDbCredentials);

    try {
    // Attempt to establish a connection to the write database
        await writeDb.getConnection();
        log.info('Write database connected successfully');
    } catch (error) {
        log.error('Error connecting to write database:', error.message);
    }

    // If in production environment, configure database credentials for reading
    if (env === 'production') {
        writeDbCredentials.host = process.env.metaDbReadHost;
        writeDbCredentials.connectionLimit = 2;
    }

    // Create a connection pool for reading (may point to a different server in production)
    const readDb = createDbPool(writeDbCredentials);

    try {
    // Attempt to establish a connection to the read database
        await readDb.getConnection();
        log.info('Read database connected successfully');
    } catch (error) {
        log.error('Error connecting to read database:', error.message);
    }

    // Define global variables for read and write databases
    Object.defineProperty(global, 'readDb', {
        value: readDb,
        configurable: false,
        enumerable: true,
        writable: false
    });

    Object.defineProperty(global, 'writeDb', {
        value: writeDb,
        configurable: false,
        enumerable: true,
        writable: false
    });
};

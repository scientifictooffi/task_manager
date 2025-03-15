const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            options: { useUnifiedTopology: true },
            collection: 'logs',
            level: 'info'
        }),
    ],
});

module.exports = {
    logAction: (action, userId, details) => {
        logger.info({ action, userId, details });
    }
} 
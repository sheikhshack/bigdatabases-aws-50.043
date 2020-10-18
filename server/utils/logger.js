const {createLogger, transports, format} = require('winston')
const logging_url = require('./config').MONGODB_URI_LOG
require('winston-mongodb')

// General Logger //
const info = (...params) => {
    console.log(...params);
};

const error = (...params) => {
    console.error(...params);
};

// Database Loggers - Can be removed once authentication works //
const initOptionsGeneral = {
    level: 'info',
    db: logging_url,
    collection: 'logs',
    name: 'general_logs',
    metaKey:'meta',
    format: format.combine(format.timestamp(), format.json())

}

const initOptionsHealth = {
    db: logging_url,
    collection: 'syshealth',
    name: 'system_health',
    storeHost: true,
    format: format.combine(format.timestamp(), format.json())
}

const winstonLogger = createLogger({
    transports: [
        new transports.MongoDB(initOptionsGeneral),
        new transports.MongoDB(initOptionsHealth)

    ]
})

module.exports = {
    info, error, winstonLogger
};
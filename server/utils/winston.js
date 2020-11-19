const {createLogger, transports, format} = require('winston')
const expressWinston = require('express-winston');
// const logsRouter = require('../controller/logs')

const logging_url = require('./config').MONGODB_URI_LOG
require('winston-mongodb')


const initOptionsGeneral = {
    level: 'info',
    db: logging_url,
    collection: 'logs',
    name: 'general_logs',
    // format: format.combine(format.timestamp(), format.json())
    metaKey: ['meta']

}

const initOptionsHealth = {
    db: logging_url,
    collection: 'syshealth',
    name: 'system_health',
    storeHost: true,
    format: format.combine(format.timestamp(), format.json())
}

const databaseLogger = expressWinston.logger({
    transports: [
        new transports.MongoDB(initOptionsGeneral),
        // new  transports.Console({
        //     format: format.json({
        //         space: 2
        //     })
        // }),
    ],
    meta: true,
    msg: "Request: HTTP {{req.method}} {{req.url}} ",
    requestWhitelist: ["url", "method", "httpVersion", "body"],
    // ignoreRoute: logsRouter,
    // dynamicMeta: function(req, res, err) { return [Object]; },  // Extract additional meta data from request or response (typically req.user data if using passport). meta must be true for this function to be activated
    bodyBlacklist: ['password'],
    ignoredRoutes: ['/api/user', '/api/logs', '/logs/test']

})

const healthLogger = createLogger({
    transports: [new transports.MongoDB(initOptionsHealth)]
})

module.exports = {
    databaseLogger,
    healthLogger
}

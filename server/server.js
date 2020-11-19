const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const bodyParser = require('body-parser');
const reviewsRouter = require('./controller/reviews');
const path = require('path');

const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
// const logger = require('morgan');
// const bodyParser = require('body-parser');
const usersRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const bookRouter = require('./controller/books')
const logsRouter = require('./controller/logs')
const logger = require('./utils/logger')
const {databaseLogger, healthLogger} = require('./utils/winston')



const app = express()
mongoose.set('useCreateIndex', true)

logger.info('Connecting to', config.MONGODB_URI)

//  MongoDB Related Connections //
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true  })
    .then(() => {
        logger.info('MongoDB database connection established successfully')
        healthLogger.info('Successful pairing with MongoDB', {metadata: {
            category: 'Mongo',
            address: config.MONGODB_URI,
            online: true
            }})

    })
    .catch((err) => {
        logger.error('Problems establishing connection to MongoDB: ', err.message )
        healthLogger.error('Failed pairing with MongoDB', {metadata: {
                category: 'Mongo',
                address: config.MONGODB_URI,
                online: false,
                error: err.message
            }})

    });



// Sequelize Related Connections //
config.sequelize.authenticate()
    .then(() => {
        logger.info('MySQL server authenticated and connected successfully')
        healthLogger.info('Successful pairing with MongoDB', {metadata: {
                category: 'SQL',
                address: config.SQL_IP_ADDR,
                online: true
            }})
    })
    .catch((err) => {
        logger.error('Problems establishing connection to SQL Server: ', err.message )
        healthLogger.error('Failed pairing with SQL Server', {metadata: {
                category: 'SQL',
                address: config.SQL_IP_ADDR,
                online: false,
                error: err.message
            }})
    })

///// The following are core dependencies for making server work /////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
if (process.env.NODE_ENV !== 'development'){
    app.use(express.static('build'))

}

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(databaseLogger)

//// The following are routes, place new ones here /////

app.use('/api/book', bookRouter)
app.use('/api/user', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/review', reviewsRouter);
app.use('/api/logs', logsRouter);
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



//// The following are special post-middlewares, place new ones here /////

// app.use(middleware.unknownEndpoint);
// app.use(middleware.databaseLogger);
app.use(middleware.errorHandler);

module.exports = app


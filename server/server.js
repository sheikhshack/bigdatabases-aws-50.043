const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

// const { waitForDebugger } = require('inspector');
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
// const logger = require('morgan');
// const bodyParser = require('body-parser');
const usersRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const bookRouter = require('./controller/books')
const logger = require('./utils/logger')

const app = express()
mongoose.set('useCreateIndex', true)

logger.info('Connecting to', config.MONGODB_URI)

//  MongoDB Related Connections //
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true  })
    .then(() => {
        logger.info('MongoDB database connection established successfully')
    })
    .catch((err) => {
        logger.error('Problems establishing connection to MongoDB: ', err.message )
    });

///// The following are core dependencies for making server work /////
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)


//// The following are routes, place new ones here /////

app.use('/book', bookRouter)
app.use('/user', usersRouter)
app.use('/login', loginRouter)
// app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);




module.exports = app
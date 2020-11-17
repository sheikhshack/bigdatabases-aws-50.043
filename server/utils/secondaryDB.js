const mongoose = require('mongoose');
const config = require('./config')

// const conn = mongoose.createConnection(config.MONGODB_URI_LOG, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true  });

const conn = mongoose.createConnection(config.MONGODB_URI_LOG, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true  })
    // .then(() => {
    //     console.log('MongoDB database connection established successfully')
    //     // healthLogger.info('Successful pairing with MongoDB', {metadata: {
    //     //         category: 'Mongo',
    //     //         address: config.MONGODB_URI,
    //     //         online: true
    //     //     }})
    //
    // })
    // .catch((err) => {
    //     console.log('Problems establishing connection to MongoDB: ', err.message )
    //     // healthLogger.error('Failed pairing with MongoDB', {metadata: {
    //     //         category: 'Mongo',
    //     //         address: config.MONGODB_URI,
    //     //         online: false,
    //     //         error: err.message
    //     //     }})
    //
    // });

module.exports = conn;
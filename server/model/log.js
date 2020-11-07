const mongoose = require('mongoose');
const secondConnection = require('../utils/secondaryDB')

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const logSchema = mongoose.Schema({
    timestamp: { type: Date },
    level: { type: String},
    message: { type: String},
    meta: {
        req:{
            url: String,
            method: String,
            httpVersion: String
        },
        res: {
            statusCode: Number
        },
        responseTime: Number
    }
})

// const logSchema = mongoose.Schema({
//     timestamp: { type: Date },
//     level: { type: String},
//     message: { type: String},
//     meta: {
//         category: String,
//         address: String,
//         online: Boolean
//     },
//     hostname: String
// })

const db = mongoose.connection.useDb('logger')
module.exports = db.model('logs', logSchema, 'logs');
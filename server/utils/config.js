require('dotenv').config()
const { Sequelize } = require('sequelize')

let MONGODB_URI = process.env.MONGODB_URI
let MONGODB_URI_LOG = process.env.MONGODB_URI_LOG
let ACCESS_KEY = process.env.ACCESS_KEY
let SQL_IP_ADDR = process.env.SQL_IP_ADDR
let SQL_USR = process.env.SQL_USR
let SQL_PASS = process.env.SQL_PASS
let MONGO_DB_SHORT = 'logger'

const sequelize = new Sequelize('kindleReviews', SQL_USR, SQL_PASS, {
    host: SQL_IP_ADDR,
    dialect: 'mysql'
})

module.exports = {
    MONGODB_URI,
    MONGODB_URI_LOG,
    ACCESS_KEY,
    sequelize,
    SQL_IP_ADDR
};
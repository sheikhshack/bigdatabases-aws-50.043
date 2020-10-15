require('dotenv').config()
const { Sequelize } = require('sequelize')

let MONGODB_URI = process.env.MONGODB_URI
let ACCESS_KEY = process.env.ACCESS_KEY

const sequelize = new Sequelize('kindleReview', 'user', 'password', {
    host: '54.145.207.233',
    dialect: 'mysql'
})

module.exports = {
    MONGODB_URI,
    ACCESS_KEY,
    sequelize
};
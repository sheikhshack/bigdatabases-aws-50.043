require('dotenv').config();

let MONGODB_URI = process.env.MONGODB_URI
let ACCESS_KEY = process.env.ACCESS_KEY

module.exports = {
    MONGODB_URI,
    ACCESS_KEY
};
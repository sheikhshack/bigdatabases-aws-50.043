const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('kindleReview', 'user', 'password', {
    host: '54.145.207.233',
    dialect: 'mysql'
  });

module.exports = sequelize;
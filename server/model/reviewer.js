const Sequelize = require("sequelize");
// TODO: Import the sequelize connection and use it to create the model
const sequelize = require('../utils/config').sequelize
const Review = require('./review.js')

const User = sequelize.define("User", {
    reviewerID: {
        type: Sequelize.STRING(35),
        allowNull: false,
        primaryKey: true
    },
    reviewerName: {
        type: Sequelize.STRING(20),
    },
    email: {
        type: Sequelize.STRING(35),
      },
    password: {
        type: Sequelize.STRING(35),
    },
  },
  {
    tableName: 'kindle_Users',
    timestamps: false
  });

User.hasMany(Review);

module.exports = User;
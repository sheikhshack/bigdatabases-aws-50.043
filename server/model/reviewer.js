const Sequelize = require("sequelize");
// TODO: Import the sequelize connection and use it to create the model
const sequelize = require('../utils/config').sequelize

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
        allowNull: false,
        unique: true
      },
    passwordHash: {
        type: Sequelize.STRING(35),
    },
  },
  {
    tableName: 'kindle_Users',
    timestamps: false,
      // defaultScope: {
      //     attributes: { exclude: ['passwordHash'] },
      // }
      scopes: {
          withoutHash: {
              attributes: { exclude: ['passwordHash'] },
          }
      }
  });



module.exports = User;
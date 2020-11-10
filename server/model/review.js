
const Sequelize = require("sequelize");
// TODO: Import the sequelize connection and use it to create the model
const sequelize = require('../utils/config').sequelize
// TODO: Import Users model for association
const User = require('./reviewer.js')

// sequelize.define('User', {
//     // ... (attributes)
//   }, {
//     freezeTableName: true
//   });

// module.exports = sequelize.define("reviewerID", {
//   id: {
//     type: Sequelize.STRING(13),
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   content: Sequelize.STRING(300)
// });


const Review = sequelize.define("Reviews", {
  id: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true
  },
  asin: {
    type: Sequelize.STRING(35),
    allowNull: false,
    unique: true
  },
  helpful: {
    type: Sequelize.STRING(35),
    allowNull: true,
  },
  overall: {
    type: Sequelize.INTEGER(35),
    allowNull: false,
  },
  reviewText: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  reviewTime: {
      type: Sequelize.STRING(35),
      allowNull: false,
      unique: true
  },
  reviewerID: {
      type: Sequelize.STRING(35),
      allowNull: false
  },
  summary: {
      type: Sequelize.STRING(20),
      allowNull: true
  },
  unixReviewTime: {
    type: Sequelize.BIGINT(11),
    allowNull: false
  }
},
{
  tableName: 'kindle_Review_Data',
  timestamps: false
});

// Add user model here

module.exports = Review
// await sequelize.sync({ force: true });
console.log("All models were synchronized successfully.");
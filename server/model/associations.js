const Sequelize = require("sequelize");
const User = require('./reviewer.js')
const Review = require('./review.js')

User.hasMany(Review, {foreignKey: 'reviewerID'});
Review.belongsTo(User, {foreignKey: 'reviewerID'})

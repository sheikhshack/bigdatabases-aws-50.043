
const Sequelize = require("sequelize");
sequelize.define('User', {
    // ... (attributes)
  }, {
    freezeTableName: true
  });

module.exports = sequelize.define("reviewerID", {
  id: {
    type: Sequelize.STRING(13),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  content: Sequelize.STRING(300)
});


module.exports = sequelize.define("book", {
    reviewText: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    asin: {
      type: Sequelize.STRING(35),
      allowNull: false,
      unique: true
    },
    overall: {
        type: Sequelize.INTEGER(35),
        allowNull: false,
    },
    reviewTime: {
        type: Sequelize.STRING(35),
        allowNull: false,
        unique: true
    },  
    reviewerName: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    summary: {
        type: Sequelize.STRING(20),
        allowNull: false
    }
  });

await sequelize.sync({ force: true });
console.log("All models were synchronized successfully.");
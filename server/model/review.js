
const Sequelize = require("sequelize");

//
const db = require('../model');
db.sequelize.sync()
  .then(()=>{
    server.listen(port);
  })
  .catch(e=>console.log(e));

server.on('error', onerror);
server.on('listening' , onlistening);


// sequelize.define('User', {
//     // ... (attributes)
//   }, {
//     freezeTableName: true
//   });

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
    summary: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    reviewTime: {
        type: Sequelize.STRING(35),
        allowNull: false,
        unique: true
    },  
    reviewerName: {
        type: Sequelize.STRING(20),
        allowNull: false
    }
  });


const express = require('express');
const { waitForDebugger } = require('inspector');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const usersRouter = require('./controller/users');
const loginRouter = require('./controller/login');
const reviewsRouter = require('./controller/reviews');
const port = 5000;
const { Sequelize } = require('sequelize');
//const MongoClient = require('mongodb').MongoClient;


app.use(express.json());
app.use(cors())
app.use('/user', usersRouter);
app.use('/login', loginRouter);
app.use('/review', reviewsRouter);

const uri = "mongodb+srv://jeroee:apples123@testdb.cpfwr.mongodb.net/testDb?retryWrites=true";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const sequelize = new Sequelize('kindle_Review_Data', 'root', null, {
    host: '54.91.52.173',
    dialect: 'mysql'
  });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
});
const express = require('express');
const { waitForDebugger } = require('inspector');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const usersRouter = require('./controller/users');
const loginRouter = require('./controller/login');
const port = 5000;
//const MongoClient = require('mongodb').MongoClient;

app.use(express.json());
app.use('/user', usersRouter);
app.use('/login', loginRouter);

const uri = "mongodb+srv://jeroee:apples123@testdb.cpfwr.mongodb.net/testDb?retryWrites=true";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
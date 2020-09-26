const express = require('express');
const { waitForDebugger } = require('inspector');
const app = express();
const mongoose = require('mongoose');
const port = 5000;
//const MongoClient = require('mongodb').MongoClient;

app.use(express.json()); 

const usersRouter = require('./contoller/users');
app.use('/user', usersRouter);

const uri = "mongodb+srv://jeroee:apples123@testdb.cpfwr.mongodb.net/testDb?retryWrites=true";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});
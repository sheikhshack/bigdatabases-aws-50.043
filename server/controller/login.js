const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../model/user');
const { response } = require('express');
require('dotenv').config()

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ "username": username });
    const passwordCheck = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);
    if (!(user && passwordCheck)) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    const userToken = {
        username: user.username,
        id: user._id
    };
    const token = jwt.sign(userToken, process.env.ACCESS_KEY);
    // response.status(200).send({ token, username: user.username, name: user.name });
    // console.log('login successful')
    return res.json(token)
});

function authenticateToken(req, res, nex) {

}

module.exports = loginRouter; 

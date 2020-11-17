const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../model/reviewer');
const config = require('../utils/config')
loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where:{
        email: email
        } });
    const passwordCheck = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);
    if (!(user && passwordCheck)) {
        res.status(401).json({ error: "Invalid email or password" });
    }
    const userToken = {
        email: user.email,
        reviewerName: user.reviewerName,
        reviewerID: user.reviewerID
    };
    const token = jwt.sign(userToken, config.ACCESS_KEY);

    res
        .status(200)
        .send({ token, username: user.reviewerID, name: user.reviewerName, email: user.email })
});


module.exports = loginRouter;

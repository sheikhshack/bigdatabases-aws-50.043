const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../model/user');
const config = require('../utils/config')
loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ "email": email });
    const passwordCheck = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);
    if (!(user && passwordCheck)) {
        res.status(401).json({ error: "Invalid email or password" });
    }
    const userToken = {
        email: user.email,
        id: user._id
    };
    const token = jwt.sign(userToken, config.ACCESS_KEY);

    res
        .status(200)
        .send({ token, username: user.username, name: user.name, email: user.email })
});


module.exports = loginRouter;

const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { response, json } = require('express')
const User = require('../model/user');    //User is the Collection

// get all the users
usersRouter.get('/viewAll', async (req, res) => {
    const getAll = await User.find()
    return res.json(getAll)
})

//adding new users to the collection with password of created users hashed in the db
usersRouter.post('/signUp', async (req, res) => {
    const { name, username, email, password } = req.body;
    if (!password || password.length < 10 || password.match(/^[A-Za-z]+$/) || password.match(/^[0-9]+$/)) {
        return res.status(400).json({ error: "Please key in an alphanumeric password of minimum 10 characters" });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    //Admin status 
    var isAdmin = false;
    const newUser = User({ name, username, email, passwordHash, isAdmin });
    const addedUser = await newUser.save()
    return res.json(addedUser)
});
//locate individual user by username
usersRouter.get('/searchByUsername=:username', async (req, res) => {
    const searchByUsername = await User.findOne({ "username": req.params.username })
    return res.json(searchByUsername)
});
//locate individual user by email
usersRouter.get('/searchByEmail=:email', async (req, res) => {
    const searchByEmail = await User.findOne({ "email": req.params.email })
    return res.json(searchByEmail)
});

//delete individual user by id
usersRouter.delete('/deleteById=:id', async (req, res) => {
    const deleteById = await User.findByIdAndDelete(req.params.id)
    return res.json(deleteById)
});

//delete all non-admin users
usersRouter.delete('/deleteNonAdmins', async (req, res) => {
    const deleteNonAdmins = await User.deleteMany({ isAdmin: false });
    return res.json(deleteNonAdmins)
});

module.exports = usersRouter;


//change password by email in the collection
// usersRouter.put('/changePasswordByEmail=:email', async (req, res) => {
//     const newPassword = { password: req.body.password };
//     const changedPassword = await User.findOneAndUpdate({ "email": req.params.email }, newPassword, { new: true });
//     return res.json(changedPassword)
// });

//update admin status by id in the collection
// usersRouter.put('/adminStatus=:email', async (req, res) => {
//     const adminStatus = { isAdmin: req.body.isAdmin };
//     const changedStatus = await User.findOneAndUpdate({ "email": req.params.email }, adminStatus, { new: true });
//     return res.json(changedStatus)
// });


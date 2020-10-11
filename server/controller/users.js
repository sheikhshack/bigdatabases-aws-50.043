const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/user');    //User is the Collection

// get all the users
usersRouter.get('/all', async (req, res) => {
    const getAll = await User.find()
    res.json(getAll)
})

//adding new users to the collection with password of created users hashed in the db
usersRouter.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;
    if (!password || password.length < 10 || password.match(/^[A-Za-z]+$/) || password.match(/^[0-9]+$/)) {
        return res.status(400).json({ error: "Please key in an alphanumeric password of minimum 10 characters" });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    //Admin status
    const newUser = User({ name, username, email, passwordHash, isAdmin: false });
    const addedUser = await newUser.save()
    res.json(addedUser)
});
//locate individual user by username
usersRouter.get('/searchByUsername=:username', async (req, res) => {
    const searchByUsername = await User.findOne({ "username": req.params.username })
    res.json(searchByUsername)
});
//locate individual user by email
usersRouter.get('/searchByEmail=:email', async (req, res) => {
    const searchByEmail = await User.findOne({ "email": req.params.email })
    res.json(searchByEmail)
});

//delete individual user by id
usersRouter.delete('/deleteById=:id', async (req, res) => {
    const deleteById = await User.findByIdAndDelete(req.params.id)
    res.json(deleteById)
});

//delete all non-admin users
usersRouter.delete('/deleteNonAdmins', async (req, res) => {
    const deleteNonAdmins = await User.deleteMany({ isAdmin: false });
    res.json(deleteNonAdmins)
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


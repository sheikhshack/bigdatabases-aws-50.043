const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/reviewer');    //User is the Collection
const utils = require('../utils/util')

// get all the users
usersRouter.get('/all', async (req, res) => {
    const getAll = await User.find()
    res.json(getAll)
})

//adding new users to the collection with password of created users hashed in the db
usersRouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const reviewerName = req.body.name
    //TODO:  req._routeWhitelists.body = ['username', 'email']; // But not 'password' or 'confirm-password' or 'top-secret'
    if (!password || password.length < 10 || password.match(/^[A-Za-z]+$/) || password.match(/^[0-9]+$/)) {
        return res.status(400).json({ error: "Please key in an alphanumeric password of minimum 10 characters" });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    //Admin status
    const reviewerID = "CSTMUSR".concat(utils.asinStringGenerator())
    console.log('ID generated is', reviewerID)
    const newUser = new User({ reviewerID, reviewerName, email, passwordHash});
    const addedUser = await newUser.save()
    res.json(addedUser)
});
//locate individual user by username
usersRouter.get('/searchByID=:id', async (req, res) => {
    const IDquery = String(req.params.id)
    const searchByUsername = await User.scope('withoutHash').findOne({where: {
        reviewerID: IDquery
        }})
    res.json(searchByUsername)
});
//locate individual user by email
usersRouter.get('/searchByEmail=:email', async (req, res) => {
    const searchByEmail = await User.scope('withoutHash').findOne({where: {
            reviewerID: String(req.params.email)
        }})
    res.json(searchByEmail)
});

//delete individual user by id
usersRouter.delete('/deleteById=:id', async (req, res) => {
    const deleteById = await User.scope('withoutHash').destroy({
        where: {
            reviewerID: String(req.params.id)
        }
    })
    res.json(deleteById)

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


// user.route.js

const router = require('express').Router();
let User = require('../model/user.model');    //User is the Collection

// get all the users(document in the collection)
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

//adding new users to the collection
router.route('/add').post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin
    const newUser = new User({ name,email,password,isAdmin });

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

//locate individual user by id in the collection
router.route('/findById=:id').get((req, res) => {
    User.findById(req.params.id)
        .then(exercise => res.json(exercise))
        .catch(err => res.status(400).json('Error: ' + err));
});

//locate individual user by email in the collection
router.route('/findByEmail=:email').get((req, res) => {
    User.find({"email": req.params.email})
        .then(exercise => res.json(exercise))
        .catch(err => res.status(400).json('Error: ' + err));
});

//delete individual user by id in the collection
router.route('/deleteById=:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

//change password by email in the collection
router.route('/changePasswordByEmail=:email').put((req, res) => {
    User.find({"email": req.params.email})
        .then(user => {
            user.password = req.body.password;

            user.save()
                .then(() => res.json('User updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//update admin status by id in the collection
router.route('/changeAdminById=:id').put((req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.isAdmin = req.body.isAdmin;

            user.save()
                .then(() => res.json('User updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;    
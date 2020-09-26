// user.route.js

const usersRouter = require('express').Router();
const { response, json } = require('express');
let User = require('../model/user');    //User is the Collection

// get all the users
usersRouter.get('/', async(req,res)=>{
    const getAll = await User.find()
    return res.json(getAll)
})

//adding new users to the collection
usersRouter.post('/signup', async (req,res) => {
    const{name,email,password,isAdmin}=req.body
    const newUser = User({name,email,password,isAdmin});
    addedUser = await newUser.save()
    return res.json(addedUser)
});

//locate individual user by id in the collection
usersRouter.get('/searchById=:id', async (req,res) => {
    const searchById = await User.findById(req.params.id)
    return res.json(searchById)
});

//locate individual user by email in the collection
usersRouter.get('/searchByEmail=:email', async(req,res) => {
    const searchByEmail = await User.findOne({"email": req.params.email})
    return res.json(searchByEmail)
})

//delete individual user by id in the collection
usersRouter.delete('/deleteById=:id', async(req,res) => {
    const deleteById = await User.findByIdAndDelete(req.params.id)
    return res.json(deleteById)
});

//change password by email in the collection
usersRouter.put('/changePasswordByEmail=:email',async(req,res) => {
    const newPassword = {password:req.body.password};
    const changedPassword = await User.findOneAndUpdate({"email": req.params.email}, newPassword, {new : true});
    return res.json(changedPassword)
});

//update admin status by id in the collection
usersRouter.put('/AdminStatus=:email',async(req,res) => {
    const adminStatus = {isAdmin:req.body.isAdmin};
    const changedStatus = await User.findOneAndUpdate({"email": req.params.email}, adminStatus, {new : true});
    return res.json(changedStatus)
});

module.exports = usersRouter;   
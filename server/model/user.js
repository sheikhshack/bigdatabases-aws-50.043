// user.model.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRound = 10;

const Schema = mongoose.Schema;

//Define Schema for Users Collection
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 7
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    passwordHash: {
        type: String,
        required: true,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Users', userSchema);
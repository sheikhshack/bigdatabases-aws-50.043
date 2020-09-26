// user.model.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required:true,
        trim: true,
        minlength: 3
    },
    isAdmin: {
        type: Boolean,
        required: true,
        trim: true,
        minlength: 3
    },

}, {
    timestamps: true,
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
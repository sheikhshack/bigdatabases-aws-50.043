// user.model.js
const mongoose = require('mongoose');
const unqiueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Define Schema for Users Collection
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 3 },
    username: { type: String, required: true, trim: true, unique: true, minlength: 7} ,
    email: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    passwordHash: String,
    isAdmin: { type: Boolean,  required: true },
    }, {
        timestamps: true,
    });

userSchema.plugin(unqiueValidator)

// This part is for security sir
userSchema.set('toJSON', {
    transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
    delete returnedObj.createdAt
    delete returnedObj.updatedAt
    }
})

module.exports = mongoose.model('Users', userSchema);
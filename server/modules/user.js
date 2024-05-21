const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

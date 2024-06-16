const mongoose = require('mongoose');

const pgOwnerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
       // match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    address: {
        type: String,
        // required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        // required: true,
        trim: true
    },
    pincode: {
        type: String,
        // required: true,
        trim: true
    },
    messName: {
        type: String,
        trim: true
    },
    aboutMess: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    profilePhoto: {
        type: String,
        trim: true
    },
    messPhoto: [{
        type: String,
        trim: true
    }],
    facility: [{
        type: String,
        trim: true
    }],
   is_verified_Owner:{
        type: Boolean,
        default: false
   } 
});

const PgOwner = mongoose.model('Pgowner', pgOwnerSchema);

module.exports = PgOwner;

// firstName: '',
// lastName: '',
// email: '',
// address: '',
// password: '',
// pincode: '',
// mobileNo: '',
// messName: '',
// aboutMess: '',
// location: '',
// profilePhoto:''
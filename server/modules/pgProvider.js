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
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    },
    checkboxData: {
        type: Map,
        of: Boolean
    },
    messName: {
        type: String,
        trim: true
    },
    messDetails: {
        type: String,
        trim: true
    },
    profilePhoto: {
        type: String,
        trim: true
    },
    messPhotos: [{
        type: String,
        trim: true
    }]
});

const PgOwner = mongoose.model('PgOwner', pgOwnerSchema);

module.exports = PgOwner;


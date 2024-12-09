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
        required: function() {
            return !this.googleId;
        }
        
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    mobileNo: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    pincode: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    messName: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    aboutMess: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    location: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    profilePhoto: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    messPhoto: [{
        type: String,
        required: function() {
            return !this.googleId;
        }
    }],
    facility: [{
        type: String,
        required: function() {
            return !this.googleId;
        }
    }],
   is_verified_Owner:{
        type: Boolean,
        default: false
   } ,
   googleId: {
    type: String,
    unique: true,
    sparse: true, // Allow nulls and duplicates when not provided
  },
  image: {
    type: String,
  },
  created_at: {
    type: Date,
    default:Date.now
  },
 
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
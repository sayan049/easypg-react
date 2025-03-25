const mongoose = require('mongoose');
const geohash = require('ngeohash');


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
      type: {
          type: String,
          enum: ['Point'], 
          required: function() { return !this.googleId; }
      },
      coordinates: {
          type: [Number], 
          required: function() { return !this.googleId; }
      }
  },

  geoHash: { type: String, index: true },
    
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
    gender: {
        type: String,
        enum: ['Girls Pg', 'Boys Pg', 'Coed Pg'], // "Coed" for mixed-gender mess
        required: function() {
            return !this.googleId;
        }
    },
    roomInfo: [
        {
          room: {
            type: String, // Changed from Number to String
            required: function() {
                return !this.googleId;
            }
          },
          bedContains: {
            type: String,
            enum: ['one', 'two', 'three', 'four', 'five'], // Maximum 5 beds in a room
            required: function() {
                return !this.googleId;
            }
          },
          pricePerHead: {
            type: Number,
            required: function() {
                return !this.googleId;
            }
          },
          roomAvailable: {
            type: Boolean,
            default: true,
            required: function() {
                return !this.googleId;
            }
          },
        },
      ],

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

  refreshTokens: [
    {
      token: { type: String, required: true }, // Refresh token
      device: { type: String, required: true }, // Device info
      createdAt: { type: Date, default: Date.now }, // Creation timestamp
    },
  ],

 
});
pgOwnerSchema.pre('save', function(next) {
  if (this.location && this.location.coordinates.length === 2) {
      this.geoHash = geohash.encode(this.location.coordinates[1], this.location.coordinates[0], 7);
  }
  next();
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
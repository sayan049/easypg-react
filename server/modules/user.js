const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  address: {
    type: String,
    required: function() {
      return !this.googleId;
    },
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; 
    },
  },
  pin: {
    type: String,
    required: function() {
      return !this.googleId; 
    },
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
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
  refreshToken: { type: String, default: null },
 

});

const User = mongoose.model("User", userSchema);

module.exports = User;

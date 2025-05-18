const mongoose = require('mongoose');
const { Schema } = mongoose;

const OTPSchema = new Schema({
  // Reference to user (if user exists)
  
  // Email being verified
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  
  // The OTP code
  code: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 6
  },
  
  
  // When the OTP was created
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '5m' // Auto-delete after 5 minutes
  },
  
  // Number of attempts made
  attempts: {
    type: Number,
    default: 0,
    max: 3 // Maximum allowed attempts
  },
  
  

});

// Index for faster queries
OTPSchema.index({ email: 1, purpose: 1 });
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;
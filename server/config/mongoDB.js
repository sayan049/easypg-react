/* This code snippet is a JavaScript file that sets up a connection to a MongoDB database using
Mongoose. Here's a breakdown of what it does: */
// config/db.js
const mongoose = require("mongoose");
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

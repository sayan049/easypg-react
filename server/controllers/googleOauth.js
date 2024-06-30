// googleAuth.js
require('dotenv').config();
// googleAuth.js

const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const User = require('../modules/user');

passport.use(
  new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if a user already exists with the same email
      let existingUser = await User.findOne({ email: profile.emails[0].value });

      if (existingUser) {
        // Update the existing user's Google ID
        existingUser.googleId = profile.id;
        existingUser.image = profile.photos[0].value;
        await existingUser.save();
        // Store user ID and name in session
        const userSession = {
          id: existingUser._id,
          name: existingUser.firstName,
        };
        return done(null, userSession);
      } else {
        // Create new user
        const newUser = new User({
          googleId: profile.id,
          firstName: profile.name.givenName || profile.displayName,
          lastName: profile.name.familyName || ' ',
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          is_verified: true,
        });
        await newUser.save();
        // Store user ID and name in session
        const userSession = {
          id: newUser._id,
          name: newUser.firstName,
        };
        return done(null, userSession);
      }
    } catch (error) {
      return done(error, null);
    }
  })
);

passport.serializeUser((userSession, done) => {
  done(null, userSession); // Serialize the entire userSession object
});

passport.deserializeUser(async (userSession, done) => {
  try {
    // For simplicity, directly return the userSession object
    done(null, userSession);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

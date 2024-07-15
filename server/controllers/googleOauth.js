require("dotenv").config();
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true, // Pass the request object to the callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userType = req.query.state
          ? JSON.parse(req.query.state).type
          : "student";

        if (userType === "student") {
          let existingUser = await User.findOne({
            email: profile.emails[0].value,
          });

          if (existingUser) {
            // Return an error if the email is already in use
            console.log("used email")
            return done(null, false, { message: "Email is already in use" });
          } else {
            const newUser = new User({
              googleId: profile.id,
              firstName: profile.name.givenName || profile.displayName,
              lastName: profile.name.familyName || " ",
              email: profile.emails[0].value,
              image: profile.photos[0].value,
              is_verified: true
            });
            await newUser.save();
            const userSession = {
              id: newUser._id,
              name: newUser.firstName + " " + newUser.lastName,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
              image: newUser.image,
              is_verified: newUser.is_verified
            };
            return done(null, { userSession, type: "student" });
          }
        } else if (userType === "owner") {
          let existingOwner = await PgOwner.findOne({
            email: profile.emails[0].value,
          });

          if (existingOwner) {
            // Return an error if the email is already in use
            console.log("used email owner")
            return done(null, false, { message: "Email is already in use" });
          } else {
            const newOwner = new PgOwner({
              googleId: profile.id,
              firstName: profile.name.givenName || profile.displayName,
              lastName: profile.name.familyName || " ",
              email: profile.emails[0].value,
              image: profile.photos[0].value,
              is_verified_Owner: true
            });
            await newOwner.save();
            const ownerSession = {
              id: newOwner._id,
              name: newOwner.firstName + " " + newOwner.lastName,
              firstName: newOwner.firstName,
              lastName: newOwner.lastName,
              email: newOwner.email,
              image: newOwner.image,
              is_verified_Owner: newOwner.is_verified_Owner
            };
            return done(null, { ownerSession, type: "owner" });
          }
        } else {
          return done(new Error("Invalid user type"), null);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((sessionData, done) => {
  done(null, sessionData);
});

passport.deserializeUser(async (sessionData, done) => {
  try {
    if (sessionData.type === "student") {
      const student = await User.findById(sessionData.userSession.id);
      if (student) {
        done(null, { userSession: sessionData.userSession, type: "student" });
      } else {
        done(new Error("Student not found"), null);
      }
    } else if (sessionData.type === "owner") {
      const owner = await PgOwner.findById(sessionData.ownerSession.id);
      if (owner) {
        done(null, { ownerSession: sessionData.ownerSession, type: "owner" });
      } else {
        done(new Error("Owner not found"), null);
      }
    } else {
      done(new Error("Invalid user type"), null);
    }
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

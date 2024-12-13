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

        const email = profile.emails[0]?.value;
        const firstName = profile.name.givenName || profile.displayName;
        const lastName = profile.name.familyName || " ";
        const image = profile.photos[0]?.value;

        // Validate required fields
        if (!email || !firstName || !image) {
          return done(new Error("Incomplete profile information from Google"), null);
        }

        if (userType === "student") {
          let user = await User.findOne({ email });

          if (user) {
            // Existing student, create session
            if (user.googleId) {
              // Google ID exists, create session
              const userSession = {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
                is_verified: user.is_verified,
              };
              return done(null, { userSession, type: "student" });
            } else {
              // Google ID is not linked, redirect to login page
              return done(new Error("used email"),null);
            }
            
          } else {
            // New student, save to database
            const newUser = new User({
              googleId: profile.id,
              firstName,
              lastName,
              email,
              image,
              is_verified: true,
            });
            await newUser.save();
            const userSession = {
              id: newUser._id,
              name: `${newUser.firstName} ${newUser.lastName}`,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
              image: newUser.image,
              is_verified: newUser.is_verified,
            };
            return done(null, { userSession, type: "student" });
          }
        } else if (userType === "owner") {
          let owner = await PgOwner.findOne({ email });

          if (owner) {
            // Existing owner, create session
            if (owner.googleId) {
              // Google ID exists, create session
              const ownerSession = {
                id: owner._id,
                name: `${owner.firstName} ${owner.lastName}`,
                firstName: owner.firstName,
                lastName: owner.lastName,
                email: owner.email,
                image: owner.image,
                is_verified_Owner: owner.is_verified_Owner,
              };
              return done(null, { ownerSession, type: "owner" });
            }else {
              // Google ID is not linked, redirect to login page
              return done(new Error("used email owner"));
            }
            
          } else {
            // New owner, save to database
            const newOwner = new PgOwner({
              googleId: profile.id,
              firstName,
              lastName,
              email,
              image,
              is_verified_Owner: true,
            });
            await newOwner.save();
            const ownerSession = {
              id: newOwner._id,
              name: `${newOwner.firstName} ${newOwner.lastName}`,
              firstName: newOwner.firstName,
              lastName: newOwner.lastName,
              email: newOwner.email,
              image: newOwner.image,
              is_verified_Owner: newOwner.is_verified_Owner,
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

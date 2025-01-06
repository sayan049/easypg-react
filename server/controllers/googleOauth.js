require("dotenv").config();
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const jwt = require("jsonwebtoken");
const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://easypg-react.onrender.com/auth/google/callback", // Use full URL
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {

        const userType = req.query.state ? JSON.parse(req.query.state).type : "student";


        const email = profile.emails[0]?.value;
        const firstName = profile.name.givenName || profile.displayName;
        const lastName = profile.name.familyName || " ";
        const image = profile.photos[0]?.value;

        // Validate required fields
        if (!email || !firstName || !image) {
          return done(new Error("Incomplete profile information from Google"), null);
        }


        // JWT generation logic
        const generateJWT = (user, type, image = null) => {
          // Access token with image included in payload
          const accessToken = jwt.sign(
            { id: user._id, email: user.email, type, image }, // Added image to the payload
            JWT_SECRET,
            { expiresIn: "15m" }
          );

          // Refresh token without image
          const refreshToken = jwt.sign(
            { id: user._id, email: user.email, type }, // Refresh token only contains basic info
            JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
          );

          return { accessToken, refreshToken };
        };


        if (userType === "student") {
          let user = await User.findOne({ email });

          if (user) {

            // Existing student, check if Google ID is linked
            if (user.googleId) {
              const tokens = generateJWT(user, "student", image);
              return done(null, { tokens, userSession: user });
            } else {
              return done(new Error("Google ID is not linked with this student account"));
            }
          } else {
            // New student, create user and issue JWTs

            const newUser = new User({
              googleId: profile.id,
              firstName,
              lastName,
              email,
              image,
              is_verified: true,
            });
            await newUser.save();


            const tokens = generateJWT(newUser, "student", image);
            return done(null, { tokens, userSession: newUser });

          }
        } else if (userType === "owner") {
          let owner = await PgOwner.findOne({ email });

          if (owner) {

            // Existing owner, check if Google ID is linked
            if (owner.googleId) {
              const tokens = generateJWT(owner, "owner", image);
              return done(null, { tokens, ownerSession: owner });
            } else {
              return done(new Error("Google ID is not linked with this owner account"));
            }
          } else {
            // New owner, create owner and issue JWTs

            const newOwner = new PgOwner({
              googleId: profile.id,
              firstName,
              lastName,
              email,
              image,
              is_verified_Owner: true,
            });
            await newOwner.save();


            const tokens = generateJWT(newOwner, "owner", image);
            return done(null, { tokens, ownerSession: newOwner });

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


// Passport serialize and deserialize functions are not necessary anymore for JWT-based auth
// As we are not storing user data in the session, no need to serialize or deserialize


module.exports = passport;

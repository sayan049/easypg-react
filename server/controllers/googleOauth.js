require("dotenv").config();
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const jwt = require("jsonwebtoken");
const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000"; // Default to localhost if not set

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${backendUrl}auth/google/callback`, // Use full URL
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const state = req.query.state ? JSON.parse(req.query.state) : {};
        const device = state.device || ""; // Extract device info from state

        const userType = state.type || "student"; // Default to "student" if type is not provided

        const email = profile.emails[0]?.value;
        const firstName = profile.name.givenName || profile.displayName;
        const lastName = profile.name.familyName || " ";
        const image = profile.photos[0]?.value;

        // Validate required fields
        if (!email || !firstName || !image) {
          return done(
            new Error("Incomplete profile information from Google"),
            null
          );
        }

        // JWT generation logic
        const generateJWT = (user, type, image = null) => {
          const name = user.firstName + " " + user.lastName;
          const loginMethod = "google";
          // Access token with image included in payload
          const accessToken = jwt.sign(
            {
              id: user._id,
              name: name,
              email: user.email,
              type,
              image,
              loginMethod,
            }, // Added image to the payload
            JWT_SECRET,
            { expiresIn: "30m" }
          );

          // Refresh token without image
          const refreshToken = jwt.sign(
            {
              id: user._id,
              name: name,
              email: user.email,
              type,
              image,
              loginMethod,
            }, // Refresh token only contains basic info
            JWT_REFRESH_SECRET,
            { expiresIn: "10d" }
          );
          user.refreshTokens.push({
            token: refreshToken,
            device,
            createdAt: new Date(),
          });

          user.save();
        
          return { accessToken, refreshToken };
        };

        if (userType === "student") {
          let user = await User.findOne({ email });

          if (user) {
            // Existing student
            if (user.googleId) {
              const tokens = generateJWT(user, "student", image);
              return done(null, { tokens });
            } else {
              return done(
                new Error("Google ID is not linked with this student account")
              );
            }
          } else {
            // ⚠️ Check if email exists in Owner DB to prevent cross-type signup
            const ownerExists = await PgOwner.findOne({ email });
            if (ownerExists) {
              return done(
                new Error("Email already registered as an owner"),
                null
              );
            }

            // Create new student user
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
            return done(null, { tokens });
          }
        } else if (userType === "owner") {
          let owner = await PgOwner.findOne({ email });

          if (owner) {
            // Existing owner, check if Google ID is linked
            if (owner.googleId) {
              const tokens = generateJWT(owner, "owner", image);
              return done(null, { tokens });
            } else {
              return done(
                new Error("Google ID is not linked with this owner account")
              );
            }
          } else {
            // ⚠️ Check if email exists in User DB to prevent cross-type signup
            const userExists = await User.findOne({ email });
            if (userExists) {
              return done(
                new Error("Email already registered as a student"),
                null
              );
            }
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
            return done(null, { tokens });
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

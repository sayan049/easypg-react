const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('./controllers/googleOauth');
const authRoutes = require('./routes/auth');
const mailRoute = require('./routes/mailVerifierRoute');
const mailVerifyOwner = require('./routes/mailVerifyOwner');
const connectDB = require('./config/mongoDB');
const sessionConfig = require('./config/sessionStore');

const app = express();

const ORIGIN =  'https://easypg-react-client.onrender.com';
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: ORIGIN,
  credentials: true,
};
app.set('trust proxy', 1); // Trust the first proxy

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/mail', mailRoute);
app.use('/mailOwner', mailVerifyOwner);

connectDB();

// Google OAuth routes
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  state: JSON.stringify({ type: 'student' })
}));

app.get("/auth/google-owner", passport.authenticate("google", {
    scope: ["profile", "email"],
    state: JSON.stringify({ type: 'owner' }) // Route for owner login
  }));

  app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.error("Authentication Error:", err.message);
        return res.redirect(`${ORIGIN}/ProviderSeeker?error=auth_failed`);
      }
      console.log(user)
  
      if (!user) {
        console.error("No user returned from Google OAuth");
        return res.redirect(`${ORIGIN}/ProviderSeeker?error=auth_failed`);
      }
  
      // Log in the user
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Login Error:", loginErr.message);
          return res.redirect(`${ORIGIN}/ProviderSeeker?error=login_failed`);
        }
  
        // Successful authentication, redirect to home page
        return res.redirect(`${ORIGIN}`);
      });
    })(req, res, next);
  });

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("noiceeeeeee");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/`);
});
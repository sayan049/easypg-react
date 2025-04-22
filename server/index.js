const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("./controllers/googleOauth");
const authRoutes = require("./routes/auth");
const mailRoute = require("./routes/mailVerifierRoute");
const mailVerifyOwner = require("./routes/mailVerifyOwner");
const connectDB = require("./config/mongoDB");
const http = require('http'); // Import http to use with socket.io
const socketManager = require('./sockets/bookingSocket');
const app = express();
const server = http.createServer(app); // Create an HTTP server using express app
const ORIGIN = "https://easypg-react-client.onrender.com";
const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "x-device-info",
  ],
};
app.set("trust proxy", 1); // Trust the first proxy

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Initialize socket.io with the HTTP server
socketManager.init(server);
app.set('io', socketManager.io);

// app.use(sessionConfig);

app.use(passport.initialize());
// app.use(passport.session());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/mail", mailRoute);
app.use("/mailOwner", mailVerifyOwner);

connectDB();

// Google OAuth routes
app.get("/auth/google", (req, res, next) => {
  // Access the state from the query string
  const state = req.query.state;

  // Pass the state to the passport.authenticate() method
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state, // Pass the state here
  })(req, res, next);
});

app.get("/auth/google-owner", (req, res, next) => {
  // Access the state from the query string
  const state = req.query.state;

  // Pass the state to the passport.authenticate() method
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state, // Pass the state here
  })(req, res, next);
});

app.get("/auth/google/callback", (req, res, next) => {
  // Parse the state from query parameters before calling passport.authenticate
  // Log the query parameters
  const state = req.query.state ? JSON.parse(req.query.state) : {};

  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("Authentication Error:", err.message);
      return res.redirect(
        `${ORIGIN}/ProviderSeeker?error=auth_failed&details=${encodeURIComponent(
          err.message
        )}`
      );
    }
    if (!user) {
      console.error("No user returned from Google OAuth");
      return res.redirect(`${ORIGIN}/ProviderSeeker?error=auth_failed`);
    }

    // Extract tokens and device info (from the state object)
    const { accessToken, refreshToken } = user.tokens;
    const { device } = state; // Extract device info from state

    // Send the tokens and the device info to your desired callback URL
    return res.redirect(
      `${ORIGIN}/googleCallback/?accessToken=${accessToken}&refreshToken=${refreshToken}&device=${encodeURIComponent(
        device
      )}`
    );
  })(req, res, next);
});

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("noiceeeeeee");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port: http://localhost:${PORT}/`);
// });
// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/`);
});

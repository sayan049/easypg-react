// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const path = require("path");
// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");
// dotenv.config();
// const passport = require("./controllers/googleOauth");
// const authRoutes = require("./routes/auth");
// const mailRoute = require("./routes/mailVerifierRoute");
// const mailVerifyOwner = require("./routes/mailVerifyOwner");
// const connectDB = require("./config/mongoDB");
// const http = require('http');
// const { Server } = require('socket.io'); // Import Server from socket.io
// const ORIGIN = "https://easypg-react-client.onrender.com";
// const PORT = process.env.PORT || 8080;

// // Enhanced CORS configuration
// const corsOptions = {
//   origin: ORIGIN,
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "X-Requested-With",
//     "x-device-info",
//   ],
// };

// const app = express();
// const server = http.createServer(app);

// // Enhanced Socket.IO configuration
// const io = new Server(server, {
//   cors: {
//     origin: ORIGIN,
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   transports: ['websocket', 'polling'], // Explicitly specify transports
//   pingTimeout: 60000,
//   pingInterval: 25000,
//   cookie: false
// });

// // Socket.IO connection handling
// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);

//   socket.on('owner-join', (ownerId) => {
//     socket.join(`owner-${ownerId}`);
//     console.log(`Owner ${ownerId} joined room`);
//   });

//   socket.on('disconnect', (reason) => {
//     console.log('Client disconnected:', socket.id, reason);
//   });

//   socket.on('error', (error) => {
//     console.error('Socket error:', error);
//   });
// });

// app.set("trust proxy", 1);
// app.use(cors(corsOptions));
// app.use(cookieParser());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Make io accessible in routes
// app.set('io', io);

// app.use(passport.initialize());

// // Routes
// app.use("/mail", mailRoute);
// app.use("/mailOwner", mailVerifyOwner);

// // Database connection
// connectDB();

// // Google OAuth routes (unchanged)
// app.get("/auth/google", (req, res, next) => {
//   const state = req.query.state;
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     state: state,
//   })(req, res, next);
// });

// app.get("/auth/google-owner", (req, res, next) => {
//   const state = req.query.state;
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     state: state,
//   })(req, res, next);
// });

// app.get("/auth/google/callback", (req, res, next) => {
//   const state = req.query.state ? JSON.parse(req.query.state) : {};
//   passport.authenticate("google", (err, user, info) => {
//     if (err) {
//       console.error("Authentication Error:", err.message);
//       return res.redirect(
//         `${ORIGIN}/ProviderSeeker?error=auth_failed&details=${encodeURIComponent(
//           err.message
//         )}`
//       );
//     }
//     if (!user) {
//       console.error("No user returned from Google OAuth");
//       return res.redirect(`${ORIGIN}/ProviderSeeker?error=auth_failed`);
//     }

//     const { accessToken, refreshToken } = user.tokens;
//     const { device } = state;
//     return res.redirect(
//       `${ORIGIN}/googleCallback/?accessToken=${accessToken}&refreshToken=${refreshToken}&device=${encodeURIComponent(
//         device
//       )}`
//     );
//   })(req, res, next);
// });

// app.use("/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on port: http://localhost:${PORT}/`);
//   console.log(`WebSocket server is running on ws://localhost:${PORT}`);
// });
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
const prerender = require("prerender-node");
const UAParser = require("ua-parser-js");
// const http = require('http');
// const SocketManager = require('./sockets/bookingSocket'); // Update with correct path
//  const ORIGIN =  process.env.CLIENT_URL || "https://messmate-client.onrender.com"; // Default to localhost if not set
//  const ORIGIN =  "https://messmate-client.onrender.com";
const ORIGIN = process.env.CLIENT_URL; // Default to localhost if not set
const PORT = process.env.PORT || 8080;
const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN;
console.log(ORIGIN, "origin");
console.log(PRERENDER_TOKEN, "prerender");
// Enhanced CORS configuration
const corsOptions = {
  origin: ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "x-device-info",
    "Access-Control-Allow-Credentials",
  ],
  exposedHeaders: ["Set-Cookie"],
};

const app = express();

app.set("trust proxy", 1);

// Force HTTPS redirect
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});
// Prerender.io middleware - for serving bots clean HTML

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || ORIGIN);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});
app.use(cors(corsOptions));
prerender.set("prerenderToken", PRERENDER_TOKEN);
app.use(prerender);

app.use(passport.initialize());

// Database connection
connectDB();
// Routes
app.use("/mail", mailRoute);
app.use("/mailOwner", mailVerifyOwner);
app.use("/auth", authRoutes);

// Google OAuth routes
app.get("/auth/google", (req, res, next) => {
  const state = req.query.state;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  })(req, res, next);
});

app.get("/auth/google-owner", (req, res, next) => {
  const state = req.query.state;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  })(req, res, next);
});

app.get("/auth/google/callback", (req, res, next) => {
  const state = req.query.state ? JSON.parse(req.query.state) : {};
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("Authentication Error:", err.message);
      return res.redirect(
        `${ORIGIN}/choose-role?error=auth_failed&details=${encodeURIComponent(
          err.message
        )}`
      );
    }
    if (!user) {
      console.error("No user returned from Google OAuth");
      return res.redirect(`${ORIGIN}/choose-role?error=auth_failed`);
    }

    const { accessToken, refreshToken } = user.tokens;

    // Parse userAgent string sent in state.device
    const userAgentString = state.device || "";
    const parser = new UAParser(userAgentString);
    const os = parser.getOS(); // e.g. { name: 'iOS', version: '15.3' }
    const browser = parser.getBrowser(); // e.g. { name: 'Safari', version: '15.1' }

    // Check for Apple device + Safari browser
    const isAppleDevice = os.name === "iOS" || os.name === "Mac OS";
    const isSafariBrowser = browser.name === "Safari";

    const isAppleSafari = isAppleDevice && isSafariBrowser;

    const accessTokenCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 60 * 1000,
    };

    const refreshTokenCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    };

    if (isAppleSafari) {
      accessTokenCookieOptions.partitioned = true;
      refreshTokenCookieOptions.partitioned = true;
      console.log("Setting partitioned cookies for Apple Safari (iOS/macOS)");
    } else {
      console.log("Setting normal cookies for other browsers");
    }

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.redirect(
      `${ORIGIN}/googleCallback?authSuccess=true&device=${encodeURIComponent(
        userAgentString
      )}`
    );
  })(req, res, next);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

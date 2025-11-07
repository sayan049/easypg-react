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
const MissedSocketEvent = require("./modules/missedSocket");
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const axios = require("axios");

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

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    credentials: true,
  },
});
// const startExpirationJob = require("./cron/expire");
// startExpirationJob(io);
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-owner-room", async (ownerId) => {
    socket.join(ownerId);
    // Emit missed events
    const missedEvents = await MissedSocketEvent.find({
      recipientId: ownerId,
      recipientType: "owner",
    });
    missedEvents.forEach((event) => {
      socket.emit(event.eventType, event.payload);
    });

    // Delete after sending
    await MissedSocketEvent.deleteMany({
      recipientId: ownerId,
      recipientType: "owner",
    });
    console.log(`Socket ${socket.id} joined room ${ownerId}`);
  });
  socket.on("join-user-room", async (userId) => {
    socket.join(userId);
    // Emit missed events
    const missedEvents = await MissedSocketEvent.find({
      recipientId: userId,
      recipientType: "user",
    });
    missedEvents.forEach((event) => {
      socket.emit(event.eventType, event.payload);
    });

    // Delete after sending
    await MissedSocketEvent.deleteMany({
      recipientId: userId,
      recipientType: "user",
    });
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

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
        `${ORIGIN}/signup/choose-role?error=auth_failed&details=${encodeURIComponent(
          err.message
        )}`
      );
    }
    if (!user) {
      console.error("No user returned from Google OAuth");
      return res.redirect(`${ORIGIN}/signup/choose-role?error=auth_failed`);
    }

    const { accessToken, refreshToken } = user.tokens;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      sameSite: "None",
      domain: ".messmate.co.in",
      path: "/",
      maxAge: 30 * 60 * 1000, // 30 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      sameSite: "None",
      domain: ".messmate.co.in",
      path: "/",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    const { device } = state;
    return res.redirect(
      `${ORIGIN}/googleCallback?authSuccess=true&device=${encodeURIComponent(
        device
      )}`
    );
  })(req, res, next);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
//zoho mail
app.get("/oauth/zoho/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    // Exchange code for access & refresh tokens
    const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        code: code,
        client_id: "ZOHO_CLIENT_ID",
        client_secret: "ZOHO_CLIENT_SECRET",
        redirect_uri: "https://api.messmate.co.in/oauth/zoho/callback", // same as in Zoho app
        grant_type: "authorization_code",
      },
    });

    console.log("✅ Tokens received:", response.data);

    res.send(`
      <h2>✅ Authorization Successful!</h2>
      <p>Access Token: ${response.data.access_token}</p>
      <p>Refresh Token: ${response.data.refresh_token}</p>
      <p>Copy and save these securely for your backend.</p>
    `);
  } catch (error) {
    console.error("❌ Token exchange failed:", error.response?.data || error.message);
    res.status(500).send("Error exchanging code for tokens.");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port: http://localhost:${PORT}/`);
//   console.log(`WebSocket server is running on ws://localhost:${PORT}`);
// });
server.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

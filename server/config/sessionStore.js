
// // // config/sessionStore.js
// // const session = require("express-session");
// // const MongoDBStore = require("connect-mongodb-session")(session);
// // require("dotenv").config();

// // const MONGODB_URI = process.env.MONGODB_URI;
// // const SECRET = process.env.SECRET;

// // const store = new MongoDBStore({
// //   uri: MONGODB_URI,
// //   collection: "sessions",
// //   autoRemove: "native",
// // });

// // store.on("error", function (error) {
// //   console.error("Session store error:", error);
// // });

// // const sessionConfig = session({
// //   secret: process.env.SECRET,
// //   resave: false,
// //   saveUninitialized: false,
// //   store: store,
// //   cookie: {
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
// //     maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
// //     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Adjust for cross-origin
// //   },
// // });


// // module.exports = sessionConfig;

// // config/sessionStore.js
// const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
// require("dotenv").config();

// const MONGODB_URI = process.env.MONGODB_URI;
// const SECRET = process.env.SECRET;

// const store = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: "sessions",
//   autoRemove: "native",
// });

// store.on("error", function (error) {
//   console.error("Session store error:", error);
// });

// const sessionConfig = session({
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
//     maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Adjust for cross-origin
//   },
// });


// module.exports = sessionConfig;


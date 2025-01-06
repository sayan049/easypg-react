const express = require("express");
const router = express.Router();
const authHandlers = require("../controllers/authHandlers");
const upload = require("../middleware/upload");
const ensureAuthenticated = require("../middleware/is-auth");
const updateDetailshandler =require("../controllers/updateDetails")
const forgotPasswordUser = require("../controllers/forgotPasswordUser")
const resetPasswordUser = require("../controllers/resetPasswordUser")

const forgotPasswordOwner = require("../controllers/forgotPasswordOwner")
const resetPasswordOwner = require("../controllers/resetPasswordOwner")
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


router.post("/signup", authHandlers.signupHandler);
router.post("/login", authHandlers.loginHandler);
router.post("/signupOwner", upload, authHandlers.signupHandlerOwner);
router.post("/loginOwner", authHandlers.loginHandlerOwner);
router.get("/findMess", authHandlers.findMess); 

// router.get("/protected", ensureAuthenticated, (req, res) => {
//   res.json({ message: "This is a protected route", user: req.session.user });
// });



router.get("/check-session", (req, res) => {
  const accessToken = req.headers['authorization']?.split(' ')[1];  // Get token from Authorization header

  if (!accessToken) {
    return res.status(401).json({ isAuthenticated: false });
  }

  // Verify the access token
  jwt.verify(accessToken, JWT_SECRET, async (err, decoded) => {
    if (err) {
      // If the access token is expired or invalid, try to refresh with the refresh token
      const refreshToken = req.headers['refreshToken'];  // Get refresh token from request headers (or localStorage)
      
      if (!refreshToken) {
        return res.status(401).json({ isAuthenticated: false });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decodedRefresh) => {
        if (err) {
          return res.status(401).json({ isAuthenticated: false });
        }

        // If refresh token is valid, generate a new access token
        const newAccessToken = jwt.sign(
          { id: decodedRefresh.id, email: decodedRefresh.email, name: decodedRefresh.name, type: decodedRefresh.type, loginMethod: decodedRefresh.loginMethod },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Send the new access token in response
        return res.status(200).json({
          isAuthenticated: true,
          user: { id: decoded.id, email: decoded.email, type: decoded.type, name: decoded.name },
          loginMethod: decodedRefresh.loginMethod,
          accessToken: newAccessToken, // Send new access token
        });
      });
    } else {
      // If the access token is valid, proceed with the user info
      res.status(200).json({
        isAuthenticated: true,
        user: { id: decoded.id, email: decoded.email, type: decoded.type, name: decoded.name },
        loginMethod: decoded.loginMethod,
      });
    }
  });
});



// =======
// router.get("/check-session", (req, res) => {
//   let user = null;
//   let loginMethod = null;

//   if (req.session && req.session.user) {
    
//     user = req.session.user;
//     loginMethod = 'local';
//   } else if (req.session && req.session.passport && req.session.passport.user) {
    
//     user = req.session.passport.user;
//     loginMethod = 'google';
//   }

//   if (user) {
//     res.status(200).json({ isAuthenticated: true, user, loginMethod });
//   } else {
//     res.status(401).json({ isAuthenticated: false });
//   }
// });

// >>>>>>> 562532821bcb4ce984acab541a68e76985fb31bc
router.post('/updateDetails',upload, updateDetailshandler.updateDetails);
router.get('/get-details', updateDetailshandler.getDetails);

// router.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send({ error: "Failed to log out" });
//     }
//     res.clearCookie("connect.sid", { httpOnly: true });
//     res.send("Logged out successfully.");
//   });
// });
router.post("/user/forgot-password", forgotPasswordUser);
// Assuming you're using Express.js


router.get('/LoginUser/user/reset-password/:resetToken', (req, res) => {
  const resetToken = req.params.resetToken;

  // Verify the token
  jwt.verify(resetToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Send the URL to the frontend instead of redirecting
    return res.json({
      message: 'Token is valid',
      resetUrl: `https://easypg-react-client.onrender.com/LoginUser?resetToken=${resetToken}`,
    });
  });
});



router.post("/user/reset-password",resetPasswordUser);

//----------------------------------------------------------------------------------->
router.post("/owner/forgot-password", forgotPasswordOwner);
router.get('/LoginOwner/owner/reset-password/:resetToken', (req, res) => {
  const resetToken = req.params.resetToken;

  // Verify the token
  jwt.verify(resetToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Send the URL to the frontend instead of redirecting
    return res.json({
      message: 'Token is valid',
      resetUrl: `https://easypg-react-client.onrender.com/LoginUser?resetToken=${resetToken}`,
    });
  });
});



router.post("/owner/reset-password",resetPasswordOwner);



module.exports = router;

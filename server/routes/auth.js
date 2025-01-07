const express = require("express");
const router = express.Router();
const authHandlers = require("../controllers/authHandlers");
const upload = require("../middleware/upload");
const refreshTokenHandler =require("../controllers/refreshTokenHandler")
const updateDetailshandler =require("../controllers/updateDetails")
const forgotPasswordUser = require("../controllers/forgotPasswordUser")
const resetPasswordUser = require("../controllers/resetPasswordUser")
const authenticateJWT = require("../middleware/is-auth")
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

router.post("refresh-token",refreshTokenHandler)

router.get("/check-session", (req, res) => {
  const accessToken = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!accessToken) {
    return res.status(401).json({ isAuthenticated: false, message: "Access token is required." });
  }

  // Verify the access token
  jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isAuthenticated: false, message: "Invalid or expired access token." });
    }

    // If the access token is valid, return user info
    return res.status(200).json({
      isAuthenticated: true,
      user: { id: decoded.id, email: decoded.email, type: decoded.type, name: decoded.name },
      loginMethod: decoded.loginMethod,
    });
  });
});





router.post('/updateDetails',upload, updateDetailshandler.updateDetails);
router.get('/get-details', updateDetailshandler.getDetails);

router.get("/logout", authenticateJWT, (req, res) => {
    res.status(200).json({ message: "Logged out successfully." });
});

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

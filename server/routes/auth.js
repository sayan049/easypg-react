const express = require("express");
const router = express.Router();
const authHandlers = require("../controllers/authHandlers");
const upload = require("../middleware/upload");
const ensureAuthenticated = require("../middleware/is-auth");
const updateDetailshandler =require("../controllers/updateDetails")
const forgotPasswordUser = require("../controllers/forgotPasswordUser")
const resetPasswordUser = require("../controllers/resetPasswordUser")
const jwt = require('jsonwebtoken');
router.post("/signup", authHandlers.signupHandler);
router.post("/login", authHandlers.loginHandler);
router.post("/signupOwner", upload, authHandlers.signupHandlerOwner);
router.post("/loginOwner", authHandlers.loginHandlerOwner);
router.get("/findMess", authHandlers.findMess); 

// router.get("/protected", ensureAuthenticated, (req, res) => {
//   res.json({ message: "This is a protected route", user: req.session.user });
// });
router.get("/check-session", (req, res) => {
  let user = null;
  let loginMethod = null;

  if (req.session && req.session.user) {
    
    user = req.session.user;
    loginMethod = 'local';
  } else if (req.session && req.session.passport && req.session.passport.user) {
    
    user = req.session.passport.user;
    loginMethod = 'google';
  }

  if (user) {
    res.status(200).json({ isAuthenticated: true, user, loginMethod });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

router.post('/updateDetails',upload, updateDetailshandler.updateDetails);
router.get('/get-details', updateDetailshandler.getDetails);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid", { httpOnly: true });
    res.send("Logged out successfully.");
  });
});
router.post("/user/forgot-password", forgotPasswordUser);
// Assuming you're using Express.js


router.get('/LoginUser/user/reset-password/:resetToken', (req, res) => {
  const resetToken = req.params.resetToken;
  console.log("Reset password route hit!");

  // Verify the token
  jwt.verify(resetToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          // If the token is invalid or expired, redirect to an error page or show an error message
          return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // If the token is valid, redirect the user to the frontend (e.g., to the login page with the modal for password reset)
      // Send the resetToken so frontend can handle it
      res.redirect(`https://easypg-react-client.onrender.com/LoginUser?resetToken=${resetToken}`);
  });
});


router.post("/user/reset-password",resetPasswordUser);

module.exports = router;

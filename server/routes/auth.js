const express = require("express");
const router = express.Router();
const authHandlers = require("../controllers/authHandlers");
const upload = require("../middleware/upload");
const ensureAuthenticated = require("../middleware/is-auth");
const updateDetailshandler =require("../controllers/updateDetails")
const forgotPasswordUser = require("../controllers/forgotPasswordUser")
const resetPasswordUser = require("../controllers/resetPasswordUser")
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
const jwt = require('jsonwebtoken');

router.get('/LoginUser/user/reset-password/:resetToken', (req, res) => {
    const resetToken = req.params.resetToken;

    jwt.verify(resetToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Token is valid, proceed with resetting password
    });
});

router.post("/user/reset-password",resetPasswordUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require('../modules/user');
const PgOwner = require('../modules/pgProvider');
const authHandlers = require("../controllers/authHandlers");
const { uploadTemp, uploadToCloudinary } = require("../middleware/upload");
const { refreshTokenHandler } = require("../controllers/refreshTokenHandler");
const updateDetailshandler =require("../controllers/updateDetails")
const forgotPasswordUser = require("../controllers/forgotPasswordUser")
const resetPasswordUser = require("../controllers/resetPasswordUser")
const authenticateJWT = require("../middleware/is-auth")
const forgotPasswordOwner = require("../controllers/forgotPasswordOwner")
const resetPasswordOwner = require("../controllers/resetPasswordOwner")
const resetPasswordDashboard=require("../controllers/resetPasswordDashboard")
const  updatePassword  =require("../controllers/updatePasswordDashboardOwner");
const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const jwt = require('jsonwebtoken');
const {
  createBookingRequest,
  handleBookingApproval,
  cancelBooking,
  getOwnerBookings,
  getUserBookings,
  generateInvoice
} = require('../controllers/bookingController');


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const apiKey = process.env.GOOGLE_PLACES;
// console.log("API Key:", apiKey);

router.get("/api/autocomplete", async (req, res) => {
  const { input } = req.query;
console.log("Input:", input);
const url = `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${input}&countrycodes=IN`;


  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text(); // Log the response text
      console.error(`Error response from LocationIQ: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from LocationIQ API:", error);
    res.status(500).send("Error fetching data");
  }
  
});
router.post("/signup", authHandlers.signupHandler);
router.post("/login", authHandlers.loginHandler);
router.post("/signupOwner",uploadTemp, uploadToCloudinary, authHandlers.signupHandlerOwner);
router.post("/loginOwner", authHandlers.loginHandlerOwner);
router.get("/findMess", authHandlers.findMess); 

// router.get("/protected", ensureAuthenticated, (req, res) => {
//   res.json({ message: "This is a protected route", user: req.session.user });
// });

router.post("/refresh-token",refreshTokenHandler)

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

    // console.log(decoded.id, decoded.email, decoded.type, decoded.name);

    // Prepare response
    const userResponse = {
      isAuthenticated: true,
      user: { id: decoded.id, email: decoded.email, type: decoded.type, name: decoded.name },
      loginMethod: decoded.loginMethod,
    };

    // If user is an owner, attach the image
    if (decoded.loginMethod === 'google') {
      userResponse.user.image = decoded.image; // Assuming the image is stored in the decoded token
    }

    // Send the response with the user data
    return res.status(200).json(userResponse);
  });
});






router.post('/updateDetails',uploadTemp, uploadToCloudinary, updateDetailshandler.updateDetails);
router.get('/get-details', updateDetailshandler.getDetails);

router.post("/logout", authenticateJWT, async (req, res) => {
  try {
    // Decode the token using `authenticateJWT` middleware
    const { id, type } = req.user; // Extract `id` and `type` from the token

    if (!id || !type) {
      return res.status(400).json({ message: "Invalid token payload." });
    }

    // Remove the refresh token based on the user type and device
    const refreshToken = req.body.refreshToken; // Assumes the refresh token is sent in the body

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required to log out." });
    }

    let user;
    if (type === "student") {
      user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const device = req.headers['x-device-info'];
      // Remove the refresh token from the stored tokens array based on the token provided
      user.refreshTokens = user.refreshTokens.filter(rt => !(rt.token === refreshToken && rt.device === device));

      await user.save();
    } else if (type === "owner") {
      user = await PgOwner.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Owner not found." });
      }

      // Remove the refresh token from the stored tokens array based on the token provided
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
      await user.save();
    } else {
      return res.status(400).json({ message: "Invalid user type." });
    }

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "An error occurred during logout." });
  }
});

router.post("/user/forgot-password", forgotPasswordUser);



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
      // resetUrl: `https://easypg-react-client.onrender.com/LoginUser?resetToken=${resetToken}`,
      resetUrl: `${frontendUrl}LoginUser?resetToken=${resetToken}`,
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
      resetUrl: `${frontendUrl}LoginUser?resetToken=${resetToken}`,
    });
  });
});



router.post("/owner/reset-password",resetPasswordOwner);
router.post("/resetPasswordDashboard",resetPasswordDashboard);
router.post("/updatePasswordDashboardOwner",  async (req, res) => {
  const { userId,currentPassword, newPassword, confirmPassword } = req.body;


  try {
    const result = await updatePassword(userId, currentPassword, newPassword, confirmPassword);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "An error occurred while updating password" });
  }
});


//booking part----------------------------------------------------------------------------------->

// User initiates booking request
router.post('/bookings',authenticateJWT, createBookingRequest);
router.get('/bookings/owner',authenticateJWT, getOwnerBookings);
router.get('/bookings/user-bookings',authenticateJWT, getUserBookings);
router.get('/bookings/:id/invoice', authenticateJWT, generateInvoice);
// Owner approves or rejects booking request
router.post('/bookings/:id/status',authenticateJWT, handleBookingApproval);

// User cancels the booking
router.delete('/bookings/:id', cancelBooking);


module.exports = router;

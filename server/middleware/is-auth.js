

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
 // const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
 const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
 //console.log("axy",token);

  if (!token) {
    return res.status(401).json({ message: "Access token is missing." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to the request
   // console.log("Decoded JWT:", decoded);  // Log the decoded token for debugging
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);  // Log the error for debugging
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateJWT;


const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const cloudinary = require('../cloudinary/cloudinaryConfig');
const bcrypt = require("bcryptjs");
const session = require("express-session");
const sendmail = require("../controllers/emailSender");
const sendmailOwner = require("./emailSenderOwner");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


exports.signupHandler = async (req, res) => {
  const email = req.body.email;


  const existnigUser = await User.findOne({ email: email });

  if (existnigUser) {
    return console.log(`${email} already used`);
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      
    });

    sendmail(req.body.firstName, email, newUser._id);
    
    res.status(201).json({ message: "User registered. Please verify your email." });
    
  } catch (error) {
    console.error("Error during signup:", error);

    res.status(500).json({ message: "Server error" });
  }
};

exports.loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const device = req.headers['x-device-info'] || req.headers['user-agent'] || 'Unknown Device'; // Extract device info from headers

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.is_verified) {
      console.log("Email not verified");
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const loginMethod = 'local';
    const name = `${user.firstName} ${user.lastName}`;

    // Generate JWT Tokens
    const accessToken = jwt.sign(
      { id: user._id, name, email: user.email, type: "student", loginMethod },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, name, email: user.email, type: "student", loginMethod },
      JWT_REFRESH_SECRET,
      { expiresIn: "10d" }
    );

    // Save Refresh Token with Device Info in the Database
    user.refreshTokens.push({
      token: refreshToken,
      device: device,
      createdAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      message: "Login successful.",
      accessToken,
      refreshToken,
    });

    console.log("Successfully logged in");
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error." });
  }
};


// Remove JSON.parse for roomInfo, no need to parse it manually
// exports.signupHandlerOwner = async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     address,
//     password,
//     pincode,
//     mobileNo,
//     messName,
//     aboutMess,
//     location,
//     facility,
//     gender,
//     roomInfo, // Directly use roomInfo from req.body
//   } = req.body;
// console.log(req.body);
//   let { profilePhoto, messPhoto } = req.files;

//   try {
//     // Check if the user already exists
//     const existingUser = await PgOwner.findOne({ email });
//     if (existingUser) {
//       console.log({ error: `${email} already exists` });
//       return res.status(400).json({ error: `${email} already exists` });
//     }

//     // Validate password
//     if (!password) {
//       console.log({ error: "Password is required" });
//       return res.status(400).json({ error: "Password is required" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Process profile photo
//     if (profilePhoto && profilePhoto[0]) {
//       const result = await cloudinary.uploader.upload(profilePhoto[0].path);
//       profilePhoto = result.secure_url; // Save Cloudinary URL
//     }

//     // Process mess photos
//     if (messPhoto && messPhoto.length > 0) {
//       const messPhotoUrls = [];
//       for (const photo of messPhoto) {
//         const result = await cloudinary.uploader.upload(photo.path);
//         messPhotoUrls.push(result.secure_url); // Save Cloudinary URLs
//       }
//       messPhoto = messPhotoUrls;
//     }

//     // Parse roomInfo if it exists
//     let parsedRoomInfo = [];
//     if (roomInfo && typeof roomInfo === 'string') {
//       try {
//         parsedRoomInfo = JSON.parse(roomInfo);
//       } catch (error) {
//         console.error("Error parsing roomInfo:", error);
//         return res.status(400).json({ error: 'Invalid roomInfo format' });
//       }
//     }

//     // Create new PG Owner
//     const newOwner = await PgOwner.create({
//       firstName,
//       lastName,
//       email,
//       address,
//       password: hashedPassword,
//       pincode,
//       mobileNo,
//       messName,
//       aboutMess,
//       location,
//       profilePhoto,
//       messPhoto,
//       facility,
//       gender,
//       roomInfo: parsedRoomInfo,
//     });

//     // Send confirmation email
//     sendmailOwner(firstName, email, newOwner._id);

//     // Return success response
//     return res.status(201).json(newOwner);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };
exports.signupHandlerOwner = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    address,
    password,
    pincode,
    mobileNo,
    messName,
    aboutMess,
    location,  // This will now contain the location as a string
    facility,
    gender,
    roomInfo,
  } = req.body;

  console.log(req.body.location);  // Log location to check the format

  try {
    // Check if the user already exists
    const existingUser = await PgOwner.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: `${email} already exists` });
    }

    // Validate password
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get processed image URLs from the middleware
    const profilePhoto = req.cloudinaryResults?.profilePhoto?.[0] || null; // Profile photo URL
    const messPhoto = req.cloudinaryResults?.messPhoto || []; // Mess photos URLs array

    // Parse roomInfo if it exists
    let parsedRoomInfo = [];
    if (roomInfo && typeof roomInfo === 'string') {
      try {
        parsedRoomInfo = JSON.parse(roomInfo);
      } catch (error) {
        console.error("Error parsing roomInfo:", error);
        return res.status(400).json({ error: 'Invalid roomInfo format' });
      }
    }

    // Parse location if it's a string
    let parsedLocation = {};
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location); // Parse location string to an object
      } catch (error) {
        return res.status(400).json({ error: 'Invalid location format' });
      }
    }

    // Validate and process location
    if (!parsedLocation || parsedLocation.type !== 'Point' || !Array.isArray(parsedLocation.coordinates) || parsedLocation.coordinates.length !== 2) {
      return res.status(400).json({ error: 'Invalid location format. Location must be in GeoJSON format (type: "Point", coordinates: [longitude, latitude])' });
    }

    // Create new PG Owner
    const newOwner = await PgOwner.create({
      firstName,
      lastName,
      email,
      address,
      password: hashedPassword,
      pincode,
      mobileNo,
      messName,
      aboutMess,
      location: parsedLocation,  // Store the location as received in GeoJSON format
      profilePhoto,
      messPhoto,
      facility,
      gender,
      roomInfo: parsedRoomInfo,
    });

    // Send confirmation email
    sendmailOwner(firstName, email, newOwner._id);

    // Return success response
    return res.status(201).json(newOwner);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




exports.findMess = async (req, res) => {
  try {
    const pgOwners = await PgOwner.find();
    // console.log(pgOwners)
    res.status(200).json(pgOwners);
  } catch (error) {
    console.error("Error fetching PG owners:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginHandlerOwner = async (req, res) => {
  const { email, password } = req.body;
  const device = req.headers['x-device-info'] || req.headers['user-agent'] || 'Unknown Device'; // Extract device info

  try {
    const pgOwner = await PgOwner.findOne({ email });
    if (!pgOwner) {
      console.log("Pg Owner not found");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, pgOwner.password);
    if (!isPasswordValid) {
      console.log("Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!pgOwner.is_verified_Owner) {
      console.log("Email not verified");
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const loginMethod = 'local';
    const name = `${pgOwner.firstName} ${pgOwner.lastName}`;

    // Generate JWT Tokens
    const accessToken = jwt.sign(
      { id: pgOwner._id, name, email: pgOwner.email, type: "owner", loginMethod },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: pgOwner._id, name, email: pgOwner.email, type: "owner", loginMethod },
      JWT_REFRESH_SECRET,
      { expiresIn: "10d" }
    );

    // Save Refresh Token with Device Info in the Database
    pgOwner.refreshTokens.push({
      token: refreshToken,
      device:device,
      createdAt: new Date(),
    });

    await pgOwner.save();

    res.status(200).json({
      message: "Login successful.",
      accessToken,
      refreshToken,
    });

    console.log("Successfully logged in");
  } catch (error) {
    console.error("Error logging in owner:", error);
    res.status(500).json({ message: "Server error." });
  }
};







const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const cloudinary = require("../cloudinary/cloudinaryConfig");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const sendmail = require("../controllers/emailSender");
const sendmailOwner = require("./emailSenderOwner");
const jwt = require("jsonwebtoken");
const geohash = require("ngeohash");
const { type } = require("os");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// exports.signupHandler = async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   const existnigUser = await User.findOne({ email: email }) && await PgOwner.findOne({ email: email });

//   if (existnigUser) {
//     return res
//       .status(409)
//       .json({ message: "Email already exists", type: "error" });
//     // return console.log(`${email} already used`);
//   }
//   try {
//     // Validate email format (basic)
//     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     if (!isValidEmail) {
//       return res
//         .status(400)
//         .json({ message: "Invalid email format", type: "error" });
//     }

//     // Validate password length
//     if (!password || password.length < 8) {
//       return res.status(400).json({
//         message: "Password must be at least 8 characters",
//         type: "error",
//       });
//     }
//     // if (!User || !(await bcrypt.compare(password, User.password))) {
//     //   return res.status(401).json({ message: "Incorrect email or password" ,type: "error" });
//     // }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const newUser = await User.create({
//       ...req.body,
//       password: hashedPassword,
//     });

//     // sendmail(req.body.firstName, email, newUser._id);

//     res.status(201).json({
//       message: "User registered. Please verify your email.",
//       type: "success",
//     });
//   } catch (error) {
//     console.error("Error during signup:", error);

//     res.status(500).json({ message: "Server error", type: "error" });
//   }
// };
exports.signupHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email exists in either User or PgOwner collection
    const userExists = await User.findOne({ email });
    const ownerExists = await PgOwner.findOne({ email });

    if (userExists || ownerExists) {
      return res
        .status(409)
        .json({ message: "Email already exists", type: "error" });
    }

    // Validate email format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return res
        .status(400)
        .json({ message: "Invalid email format", type: "error" });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
        type: "error",
      });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Optionally send email verification
    // sendmail(req.body.firstName, email, newUser._id);

    res.status(201).json({
      message: "User registered. Please verify your email.",
      type: "success",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error", type: "error" });
  }
};

exports.checkEmailVerification = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select("is_verified");
    console.log("User fetched for verification check:", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      verified: user.is_verified,
    });
  } catch (error) {
    console.error("Error checking email verification:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Find user with only the fields we need
    const user = await User.findOne({ email }).select(
      "firstName email is_verified"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        error: "Email is already verified",
      });
    }

    // Call your existing sendmail function
    await sendmail(user.firstName, email, user._id);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({
      success: false,
      error: "Error sending verification email",
    });
  }
};

exports.loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const device =
    req.headers["x-device-info"] ||
    req.headers["user-agent"] ||
    "Unknown Device"; // Extract device info from headers

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
      return res
        .status(403)
        .json({ message: "Please verify your email first." });
    }

    const loginMethod = "local";
    const name = `${user.firstName} ${user.lastName}`;

    // Generate JWT Tokens
    const accessToken = jwt.sign(
      { id: user._id, name, email: user.email, type: "student", loginMethod },
      JWT_SECRET,
      { expiresIn: "30m" }
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

     // ✅ Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      sameSite: 'none',
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });
      res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      sameSite: 'none',
     // maxAge: 24 * 60 * 60 * 1000, // 1 hour
     maxAge: 30 * 60 * 1000, // 5 minutes
    });

    res.status(200).json({
      message: "Login successful.",
     // accessToken,
      // refreshToken,
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
//     roomInfo,
//   } = req.body;

//   console.log(req.body.location); // Log location to check the format
//   // Process facility array
//   let facilities = req.body.facility;

//   // Handle case where facility might come as string
//   if (typeof facilities === "string") {
//     try {
//       facilities = JSON.parse(facilities);
//     } catch (e) {
//       facilities = facilities.split(",").map((item) => item.trim());
//     }
//   }

//   // Ensure it's an array
//   if (!Array.isArray(facilities)) {
//     facilities = [facilities];
//   }

//   try {
//     // Check if the user already exists
//     const existingUser = await PgOwner.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: ` already exists` });
//     }

//     // Validate password
//     if (!password) {
//       return res.status(400).json({ message: "Password is required" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Get processed image URLs from the middleware
//     const profilePhoto = req.cloudinaryResults?.profilePhoto?.[0] || null;
//     const messPhoto = req.cloudinaryResults?.messPhoto || [];

//     // Parse roomInfo if it exists
//     let parsedRoomInfo = [];
//     if (roomInfo && typeof roomInfo === "string") {
//       try {
//         parsedRoomInfo = JSON.parse(roomInfo);
//       } catch (error) {
//         console.error("Error parsing roomInfo:", error);
//         return res.status(400).json({ message: "Invalid roomInfo format" });
//       }
//     }

//     // Parse location if it's a string
//     let parsedLocation = {};
//     if (typeof location === "string") {
//       try {
//         parsedLocation = JSON.parse(location);
//       } catch (error) {
//         return res.status(400).json({ message: "Invalid location format" });
//       }
//     }

//     // Validate and process location
//     if (
//       !parsedLocation ||
//       parsedLocation.type !== "Point" ||
//       !Array.isArray(parsedLocation.coordinates) ||
//       parsedLocation.coordinates.length !== 2
//     ) {
//       return res.status(400).json({
//         message:
//           'Invalid location format. Location must be in GeoJSON format (type: "Point", coordinates: [longitude, latitude])',
//       });
//     }

//     // ✅ Generate GeoHash for faster searches
//     const geoHash = geohash.encode(
//       parsedLocation.coordinates[1],
//       parsedLocation.coordinates[0],
//       5
//     );

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
//       location: parsedLocation, // ✅ Store in GeoJSON format
//       geoHash, // ✅ Store computed GeoHash
//       profilePhoto,
//       messPhoto,
//       facility: facilities,
//       gender,
//       roomInfo: parsedRoomInfo,
//     });

//     // // Send confirmation email
//     // sendmailOwner(firstName, email, newOwner._id);

//     // Return success response
//     return res.status(201).json(newOwner);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
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
    location,
    facility,
    gender,
    roomInfo,
    minimumSecurityDeposit,
    rulesToStay,
    minimumBookingDuration,
  } = req.body;

  let rules = rulesToStay;
if (typeof rules === "string") {
  try {
    rules = JSON.parse(rules);
  } catch (e) {
    rules = rules.split(",").map((item) => item.trim());
  }
}
if (!Array.isArray(rules)) {
  rules = [rules];
}


  console.log(req.body.location);

  let facilities = facility;
  if (typeof facilities === "string") {
    try {
      facilities = JSON.parse(facilities);
    } catch (e) {
      facilities = facilities.split(",").map((item) => item.trim());
    }
  }
  if (!Array.isArray(facilities)) {
    facilities = [facilities];
  }

  try {
    // ❗ Check if email exists in User or PgOwner collection
    const userExists = await User.findOne({ email });
    const ownerExists = await PgOwner.findOne({ email });

    if (userExists || ownerExists) {
      return res
        .status(409)
        .json({ message: "Email already exists", type: "error" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", type: "error" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePhoto = req.cloudinaryResults?.profilePhoto?.[0] || null;
    const messPhoto = req.cloudinaryResults?.messPhoto || [];

    let parsedRoomInfo = [];
    if (roomInfo && typeof roomInfo === "string") {
      try {
        parsedRoomInfo = JSON.parse(roomInfo);
      } catch (error) {
        console.error("Error parsing roomInfo:", error);
        return res
          .status(400)
          .json({ message: "Invalid roomInfo format", type: "error" });
      }
    }

    let parsedLocation = {};
    if (typeof location === "string") {
      try {
        parsedLocation = JSON.parse(location);
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid location format", type: "error" });
      }
    }

    if (
      !parsedLocation ||
      parsedLocation.type !== "Point" ||
      !Array.isArray(parsedLocation.coordinates) ||
      parsedLocation.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message:
          'Invalid location format. Must be GeoJSON { type: "Point", coordinates: [lng, lat] }',
        type: "error",
      });
    }

    const geoHash = geohash.encode(
      parsedLocation.coordinates[1],
      parsedLocation.coordinates[0],
      5
    );

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
      location: parsedLocation,
      geoHash,
      profilePhoto,
      messPhoto,
      facility: facilities,
      gender,
      roomInfo: parsedRoomInfo,
      minimumSecurityDeposit,
      rulesToStay : rules,
      minimumBookingDuration,
    });

    // sendmailOwner(firstName, email, newOwner._id);

    return res.status(201).json({
      message: "PG Owner registered successfully. Please verify your email.",
      type: "success",
      data: newOwner,
    });
  } catch (error) {
    console.error("Error creating PG Owner:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", type: "error" });
  }
};

exports.checkEmailVerificationOwner = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const user = await PgOwner.findOne({ email }).select("is_verified_Owner");
    console.log("Owner fetched for verification check:", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Owner not found",
      });
    }

    res.status(200).json({
      success: true,
      verified: user.is_verified_Owner,
    });
  } catch (error) {
    console.error("Error checking email verification:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
exports.resendVerificationEmailOwner = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Find user with only the fields we need
    const user = await PgOwner.findOne({ email }).select(
      "firstName email is_verified_Owner"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.is_verified_Owner) {
      return res.status(400).json({
        success: false,
        error: "Email is already verified",
      });
    }

    // Call your existing sendmail function
    await sendmailOwner(user.firstName, email, user._id);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({
      success: false,
      error: "Error sending verification email",
    });
  }
};

exports.findMess = async (req, res) => {
  try {
    const { lat, lng, page = 1, limit = 5 } = req.query;

    // Validate latitude and longitude
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude are required" });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    console.log(" Latitude:", latitude, "Longitude:", longitude);

    // Generate 7-character GeoHash for user's location
    const userGeohash = geohash.encode(latitude, longitude, 5);
    console.log("🔍 User GeoHash:", userGeohash);

    // Get 7-character neighboring GeoHashes
    let neighbors = geohash
      .neighbors(userGeohash)
      .map((hash) => hash.substring(0, 5));
    neighbors.push(userGeohash); // Include user's geohash

    console.log("🗺 Neighboring GeoHashes:", neighbors);

    // Query MongoDB using correct geohashes
    const nearbyPGs = await PgOwner.find({ geoHash: { $in: neighbors } })
      .skip(skip)
      .limit(limitNum);
    const total = await PgOwner.countDocuments({ geoHash: { $in: neighbors } });

    if (nearbyPGs.length === 0) {
      console.log(" No PGs found near this location.");
      return res
        .status(200)
        .json({ message: "No PGs found near this location", data: [] });
    }

    console.log(" PGs Found:", nearbyPGs.length);
    // res.status(200).json(nearbyPGs);
    res.status(200).json({ data: nearbyPGs, total: total });
  } catch (error) {
    console.error(" Error fetching PG owners:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginHandlerOwner = async (req, res) => {
  const { email, password } = req.body;
  const device =
    req.headers["x-device-info"] ||
    req.headers["user-agent"] ||
    "Unknown Device"; // Extract device info

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
      return res
        .status(403)
        .json({ message: "Please verify your email first." });
    }

    const loginMethod = "local";
    const name = `${pgOwner.firstName} ${pgOwner.lastName}`;

    // Generate JWT Tokens
    const accessToken = jwt.sign(
      {
        id: pgOwner._id,
        name,
        email: pgOwner.email,
        type: "owner",
        loginMethod,
      },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      {
        id: pgOwner._id,
        name,
        email: pgOwner.email,
        type: "owner",
        loginMethod,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "10d" }
    );

    // Save Refresh Token with Device Info in the Database
    pgOwner.refreshTokens.push({
      token: refreshToken,
      device: device,
      createdAt: new Date(),
    });

    await pgOwner.save();

      res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      sameSite: 'none',
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });
      res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      sameSite: 'none',
     // maxAge: 24 * 60 * 60 * 1000, // 1 hour
     maxAge: 30 * 60 * 1000, // 5 minutes
    });

    res.status(200).json({
      message: "Login successful.",
      // accessToken,
      // refreshToken,
    });

    console.log("Successfully logged in");
  } catch (error) {
    console.error("Error logging in owner:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getTopRatedMesses = async (req, res) => {
  try {
    const topMesses = await PgOwner.aggregate([
      {
        $match: {
          // Ensure feedbacks exists and is an array with at least one rating
          feedbacks: { $exists: true, $type: "array", $ne: [] },
          "feedbacks.rating": { $exists: true, $ne: null },
        },
      },
      {
        $addFields: {
          // Safely calculate average rating
          averageRating: { $avg: "$feedbacks.rating" },
          // Safely get feedback count
          totalFeedbacks: {
            $cond: {
              if: { $isArray: "$feedbacks" },
              then: { $size: "$feedbacks" },
              else: 0,
            },
          },
        },
      },
      // Only include documents with valid ratings
      { $match: { averageRating: { $ne: null } } },
      // Sort by highest rating first, then by most feedbacks
      { $sort: { averageRating: -1, totalFeedbacks: -1 } },
      // Limit to 4 results
      { $limit: 4 },
      // Project only needed fields
      // {
      //   $project: {
      //     firstName: 1,
      //     lastName: 1,
      //     messName: 1,
      //     profilePhoto: 1,
      //     averageRating: 1,
      //     totalFeedbacks: 1,
      //     facility: 1,
      //     gender: 1,
      //     address: 1,
      //     roomInfo: 1,
      //     // Add any other fields you need
      //   }
      // }
    ]);

    if (!topMesses.length) {
      return res.status(404).json({ message: "No rated messes found." });
    }

    res.status(200).json({ data: topMesses });
  } catch (error) {
    console.error("Error in getTopRatedMesses:", error);
    res.status(500).json({
      message: "Failed to fetch top-rated messes",
      error: error.message,
    });
  }
};

exports.viewDetails = async (req, res) => {
  const { messId } = req.params; // Use params, not body

  try {
    const pgOwner = await PgOwner.findOne({ _id: messId });

    if (!pgOwner) {
      console.log("PG Owner not found");
      return res.status(404).json({ message: "Mess not found" });
    }

    res.status(200).json({ data: pgOwner });
  } catch (err) {
    console.error("Error fetching PG:", err);
    res.status(500).json({ message: "Server error" });
  }
};

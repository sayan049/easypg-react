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
  const email = req.body.email;
  const pass = req.body.password;
  console.log(email,pass)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found");

      return res.status(401).json({ message: "Invalid email or password." });

    }
    const isPassValid = await bcrypt.compare(pass, user.password);
    if (!isPassValid) {
      console.log("invalid user or password");

      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.is_verified === false) {
     
      return res.status(403).json({ message: "Please verify your email first." });
    }
    const loginMethod = 'local';
    const name=  user.firstName+" "+user.lastName
    // set a JWT token, that will handle authentication
    const accessToken = jwt.sign(
      { id: user._id,name:name, email: user.email, type: "student",loginMethod },
      JWT_SECRET,
      { expiresIn: "1h" } // Access token valid for 15 minutes
    );
    const refreshToken = jwt.sign(
      { id: user._id, name:name,email: user.email, type: "student",loginMethod },
      JWT_REFRESH_SECRET,
      { expiresIn: "10d" } // Refresh token valid for 7 days
    );
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful.",
      accessToken,
     refreshToken,
   
    });
 
    console.log("successfully logged in");
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error." });

  }
};

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
  } = req.body;
 let {profilePhoto, messPhoto } = req.files;
  try {
    const existingUser = await PgOwner.findOne({ email });
    if (existingUser) {
      console.log({ error: `${email} already exists` });
      return res.status(400).json({ error: `${email} already exists` });
    }

    if (!password) {
      console.log({ error: "Password is required" });
      return res.status(400).json({ error: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
      if (profilePhoto && profilePhoto[0]) {
                    const result = await cloudinary.uploader.upload(profilePhoto[0].path);
                    profilePhoto = result.secure_url; // Save Cloudinary URL
                  
                }

        if (messPhoto && messPhoto.length > 0) {
                    const messPhotoUrls = [];
                    for (const photo of messPhoto) {
                        const result = await cloudinary.uploader.upload(photo.path);
                        messPhotoUrls.push(result.secure_url); // Save Cloudinary URLs
                       
                    }
                  messPhoto = messPhotoUrls;
                    
                }

    const newUser = await PgOwner.create({
      firstName,
      lastName,
      email,
      address,
      password: hashedPassword,
      pincode,
      mobileNo,
      messName,
      aboutMess,
      location,
      profilePhoto,
      messPhoto,
      facility,
      
    });
    //console.log(newUser+" xxx"+ newUser.profilePhoto);
    sendmailOwner(req.body.firstName, email, newUser._id);
    return res.status(201).json(newUser);
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
  const email = req.body.email;
  const password = req.body.password;
  try {
    const pgOwner = await PgOwner.findOne({ email: email });
    if (!pgOwner) {
      console.log("Pg Owner not found");

      return res.status(401).json({ message: "Invalid email or password." });

      return res.status(401).send("Invalid email or password");

    }
    const passWordValid = bcrypt.compare(password, pgOwner.password);
    if (!passWordValid) {
      console.log("Invlid email or password");

      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (passWordValid && pgOwner.is_verified_Owner === false) {
      console.log("Email not verified");
      return res.status(401).json({ message: "Invalid email or password." });
    };
    const loginMethod = 'local';
    const name=pgOwner.firstName+" "+pgOwner.lastName
    //jwt sign 
    const accessToken = jwt.sign(
      { id: pgOwner._id,name:name, email: pgOwner.email, type: "owner",loginMethod },
      JWT_SECRET,
      { expiresIn: "1h" } // Access token valid for 15 minutes
    );
    const refreshToken = jwt.sign(
      { id: pgOwner._id,name:name, email: pgOwner.email, type: "owner",loginMethod },
      JWT_REFRESH_SECRET,
      { expiresIn: "10d" } // Refresh token valid for 7 days
    );
    pgOwner.refreshToken = refreshToken;
    await pgOwner.save();


    res.status(200).json({
      message: "Login successful.",
      accessToken,
      refreshToken,
     
    });
  
    console.log("succesfully logged in");
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Server error." });

  }
};






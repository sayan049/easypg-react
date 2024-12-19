const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const sendmail = require("../controllers/emailSender");
const sendmailOwner = require("./emailSenderOwner");

//jwt Secret

exports.signupHandler = async (req, res) => {
  const email = req.body.email;
  // const name = req.body.Firstname;

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
    console.log(newUser);
    console.log("---------------------------------------------------");
    res.status(201).json(newUser);
    sendmail(req.body.firstName, email, newUser._id);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginHandler = async (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found");
      return res.status(401).send("Invalid username or password");
    }
    const isPassValid = await bcrypt.compare(pass, user.password);
    if (!isPassValid) {
      console.log("invalid user or password");
      return res.status(401).send("Invalid username or password");
    }

    if (user.is_verified === false) {
      console.log("Email is not verified");
      return res.status(403).send("Not verified credentials");
    }

    // No need to set a JWT token, session will handle authentication
    req.session.user = {
      id: user._id,
      name: user.firstName +" "+ user.lastName,
      type: "student",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
      pin: user.pin,
      is_verified:user.is_verified,
      
    };
    // localStorage.setItem('ii',req.sessionId)
    res.status(200).send({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.firstName +" "+ user.lastName,
        type: "student",
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        address:user.address,
        pin:user.pin,
        is_verified:user.is_verified,
       
      },
    });
    console.log("successfully logged in");
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Failed to login");
  }
};

exports.signupHandlerOwner = async (req, res) => {
  //console.log(req.files); // Log req.files to see if files are being received
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

    const profilePhoto = req.files.profilePhoto
      ? req.files.profilePhoto[0].filename
      : null;
    // console.log("mhm  "+ typeof [req.files.messPhoto.map(file => file.filename)]);
    let messPhoto = [];

    if (req.files && req.files.messPhoto) {
      req.files.messPhoto.map((file) => {
        console.log(file.filename + "\n");
        messPhoto.push(file.filename);
      });
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
    console.log(newUser+" xxx"+ newUser.profilePhoto);
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
      return res.status(401).send("Invalid email or password");
    }
    const passWordValid = bcrypt.compare(password, pgOwner.password);
    if (!passWordValid) {
      console.log("Invlid email or password");
      return res.status(401).send("Invalid email or password");
    }
    if (passWordValid && pgOwner.is_verified_Owner === false) {
      console.log("Email not verified");
      return res.status(403).send("Not verified credentials");
    }
    req.session.user = {
      id: pgOwner._id,
      name: pgOwner.firstName+" "+pgOwner.lastName,
      type: "owner",
      firstName: pgOwner.firstName,
      lastName:pgOwner.lastName,
      email:pgOwner.email,
      address:pgOwner.address,
      mobile:pgOwner.mobileNo,
      pin:pgOwner.pincode,
      messName:pgOwner.messName,
      bioMess:pgOwner.aboutMess,
      location:pgOwner.location,
      profilePhoto:pgOwner.profilePhoto,
      messPhoto:pgOwner.messPhoto,
      facility:pgOwner.facility,
      is_verified_Owner:pgOwner.is_verified_Owner,
     
    };
    res.status(200).send({
      message: "Login successful",
      user: {
        id: pgOwner._id,
        name: pgOwner.firstName+" "+pgOwner.lastName,
        type: "owner",
        firstName: pgOwner.firstName,
        lastName:pgOwner.lastName,
        email:pgOwner.email,
        address:pgOwner.address,
        mobile:pgOwner.mobileNo,
        pin:pgOwner.pincode,
        messName:pgOwner.messName,
        bioMess:pgOwner.aboutMess,
        location:pgOwner.location,
        profilePhoto:pgOwner.profilePhoto,
        messPhoto:pgOwner.messPhoto,
        facility:pgOwner.facility,
        is_verified_Owner:pgOwner.is_verified_Owner,
       
      },
    });
    console.log("succesfully logged in");
  } catch (error) {
    console.log("Error: ", error);
    res.status(404).send("Failed to log in");
  }
};






const User = require('../modules/user');
const PgOwner = require('../modules/pgProvider');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const sendmail = require('../controllers/emailSender');


exports.signupHandler = async (req, res) => {
    const email = req.body.email;
    // const name = req.body.Firstname;
    
    const existnigUser = await User.findOne({ email: email });
   
    if (existnigUser) {
        return console.log(`${email} already used`);
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({ ...req.body, password: hashedPassword });
        console.log(newUser);
        console.log("---------------------------------------------------")
        res.status(201).json(newUser);
        sendmail(req.body.firstName,email,newUser._id);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.loginHandler = async (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("user not found");
            return res.status(401).send('Invalid username or password');

        }
        const isPassValid = await bcrypt.compare(pass, user.password);
        if (!isPassValid) {
            console.log("invalid user or password");
            return res.status(401).send('Invalid username or password');

        }
        try {
            if(user.is_verified == 0){
                console.log("Email is not verified");
                return res.status(403).send('Not verified credentials');
            }
            req.session.user = user;
            console.log("succesfully logged in")
            res.status(200).send('Login successful');
            
        } catch (error) {
            console.log("login Error:",error);
        }
        
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Failed to login');
    }
};

exports.signupHandlerOwner = async (req, res) => {
    const email = req.body.email;
    const existingUser = await PgOwner.findOne({ email: email });
    if (existingUser) {
        return console.log(`${email} already used`)
    }
    try {
        const profilePhoto = req.files.profilePhoto ? req.files.profilePhoto[0].path : null;
        const messPhotos = req.files.messPhotos ? req.files.messPhotos.map(file => file.path) : [];
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await PgOwner.create({ ...req.body, password: hashedPassword, profilePhoto: profilePhoto, messPhotos: messPhotos });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
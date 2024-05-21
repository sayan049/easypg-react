const User = require('../modules/user');
const bcrypt = require('bcryptjs');
const session = require('express-session');

exports.signupHandler = async (req, res) => {
    const email = req.body.email;
    const existnigUser = await User.findOne({ email: email });
    if (existnigUser) {
        return console.log(`${email} already used`);
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({ ...req.body, password: hashedPassword });
        res.status(201).json(newUser);
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
            return res.status(401).send('Invalid username or password');
        }
        const isPassValid = await bcrypt.compare(pass, user.password);
        if (!isPassValid) {
            return res.status(401).send('Invalid username or password');
        }
        req.session.user = user;
        res.status(200).send('Login successful');
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Failed to login');
    }
};
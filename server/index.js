// index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const passport = require("./controllers/googleOauth"); 
const authRoutes = require('./routes/auth');
const mailRoute = require('./routes/mailVerifierRoute');
const mailVerifyOwner = require('./routes/mailVerifyOwner');
const connectDB = require('./config/mongoDB');
const sessionConfig = require('./config/sessionStore'); 
const app = express();

const ORIGIN = process.env.ORIGIN || 'http://localhost:3000'; 
const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: ORIGIN,
    credentials: true,
};

app.use(passport.initialize());
app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionConfig); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/mail', mailRoute);
app.use('/mailOwner', mailVerifyOwner);

connectDB(); // Connect to MongoDB

// Google OAuth routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: `${ORIGIN}/`,
    failureRedirect: `${ORIGIN}/LoginUser`, 
}));
app.use(passport.session());
app.use('/auth', authRoutes);



// Additional routes and error handling
app.get('/',(req,res)=>{
    res.send("noiceeeeeee")
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}/`);
});

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRouts = require('./routes/auth');
const mailRoute = require('./routes/mailVerifierRoute')
const mailVerifyOwner = require('./routes/mailVerifyOwner');
const path =require('path');


const cookieParser = require('cookie-parser');




const MONGODB_URI ='mongodb+srv://easypg:PaCjM5ZdJnwjM9zW@cluster0.j3zo3x9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
  };
  


const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());

// Store for session
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions' 
});

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: "sit on my face",
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use('/api', authRouts);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connection
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log(err);
    });

// Routes
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRouts);
app.use('/mail',mailRoute);
app.use('/mailOwner',mailVerifyOwner);


// Error handling
app.use((req, res, next) => {
    res.send("page is working");
})



// server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port:\n http://localhost:${PORT}/`);
});
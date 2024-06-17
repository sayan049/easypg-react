const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const mailRoute = require('./routes/mailVerifierRoute');
const mailVerifyOwner = require('./routes/mailVerifyOwner');
const path = require('path');
const cookieParser = require('cookie-parser');

const MONGODB_URI = 'mongodb+srv://easypg:PaCjM5ZdJnwjM9zW@cluster0.j3zo3x9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
};

const app = express();
app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(cookieParser());

// Store for session
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    autoRemove: 'native'
});

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: "sit on my face", 
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        httpOnly: 'true', // Corrected to a string
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
        sameSite: 'strict' // Consider adjusting for development
    }
}));


app.use('/api', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/mail', mailRoute);
app.use('/mailOwner', mailVerifyOwner);

// Connection
mongoose
   .connect(MONGODB_URI)
   .then(result => {
        console.log('Connected to MongoDB');
    })
   .catch(err => {
        console.log(err);
    });

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port:\n http://localhost:${PORT}/`);
});

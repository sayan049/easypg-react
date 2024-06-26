// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const mailRoute = require('./routes/mailVerifierRoute');
const mailVerifyOwner = require('./routes/mailVerifyOwner');
const connectDB = require('./config/mongoDB'); // Adjusted path
const sessionConfig = require('./config/sessionStore'); // Adjusted path

const app = express();

const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';
const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: ORIGIN,
    credentials: true
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionConfig);
app.use('/api', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/mail', mailRoute);
app.use('/mailOwner', mailVerifyOwner);

// Connect to MongoDB
connectDB();

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port:\n http://localhost:${PORT}/`);
});

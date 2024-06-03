const express = require('express');
var cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRouts = require('./routes/auth');



const MONGODB_URI =
    'mongodb+srv://easypg:SitOnMyFace@cluster0.j3zo3x9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
app.use(cors())

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

// Error handling
app.use((req, res, next) => {
    res.send("page is working");
})



// server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port:\n http://localhost:${PORT}/`);
});
const express = require('express');
const router = express.Router();
const authHandlers = require('../controllers/authHandlers');
const upload = require('../middleware/upload');
const verifyMail = require('../controllers/emailSender');
const mailpath = require('../')

router.post('/signup', authHandlers.signupHandler);

router.post('/login', authHandlers.loginHandler);

router.post('/signupOwner', upload, authHandlers.signupHandlerOwner);



module.exports = router;
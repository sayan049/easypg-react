const express = require('express');
const router = express.Router();
const authHandlers = require('../controllers/authHandlers');
const upload = require('../middleware/upload');
const verifyMail = require('../controllers/emailSender');
const mailpath = require('../')

const authenticateToken = require('../middleware/authenticateToken');


router.post('/signup', authHandlers.signupHandler);

router.post('/login', authHandlers.loginHandler);

router.post('/signupOwner', upload, authHandlers.signupHandlerOwner);
router.post('/loginOwner',authHandlers.loginHandlerOwner);

router.get('/findMess',  authHandlers.findMess);
router.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router;
const express = require('express');
const router = express.Router();
const authHandlers = require('../controllers/authHandlers');

router.post('/signup', authHandlers.signupHandler);

router.post('/login', authHandlers.loginHandler);

module.exports = router;
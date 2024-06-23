const express = require('express');
const router = express.Router();
const authHandlers = require('../controllers/authHandlers');
const upload = require('../middleware/upload');


const ensureAuthenticated = require('../middleware/is-auth');

router.post('/signup', authHandlers.signupHandler);
router.post('/login', authHandlers.loginHandler);
router.post('/signupOwner', upload, authHandlers.signupHandlerOwner);
router.post('/loginOwner', authHandlers.loginHandlerOwner);

router.get('/findMess', authHandlers.findMess); // Ensure this is a valid route handler

// Apply ensureAuthenticated middleware to the /protected route
router.get('/protected', ensureAuthenticated, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.session.user });
  });
  router.get('/check-session', (req, res) => {
    if (req.session && req.session.user) {
      res.json({ isAuthenticated: true, user: req.session.user });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  router.get('/logout', (req, res) => {
    
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: 'Failed to log out' });
      }
      res.clearCookie('connect.sid', { httpOnly: true });
      res.send('Logged out successfully.');
    });
  });
  
module.exports = router;

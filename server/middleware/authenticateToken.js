const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sit on my face';

function authenticateToken(req, res, next) {
    const token = req.cookies.user_token; // Get token from cookies

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).send('Invalid token.');
    }
}

module.exports = authenticateToken;

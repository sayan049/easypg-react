function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next(); // Proceed to the protected route
        console.log(req.session)
    } else {
        res.status(401).json({ message: 'Unauthorized: Access is denied' });
    }
}
 module.exports = ensureAuthenticated;
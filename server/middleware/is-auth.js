module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
      req.user = req.session.user;
      next();
    } else if (req.session && req.session.passport && req.session.passport.user) {
      req.user = req.session.passport.user;
      next();
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
  
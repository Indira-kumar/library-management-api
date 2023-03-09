module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated) {
      return next();
    }
    res.send("Please login to access");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.send("User logged in");
  },
};

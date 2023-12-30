const passport = require("passport");

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.status(401).json({message: "Access Denied!"});
}

exports.isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated())
    return next();
  res.status(401).json({message: "Access Denied!"});
}

exports.passportMiddleware = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err)
      return next(err);
    if (!user)
      return res.status(401).json({message: info.message});
    req.logIn(user, err => {
      if (err)
        return next(err);
      next();
    });
  })(req, res, next);
}

exports.isFaculty = (req, res, next) => {
  if (req.user.role === "faculty")
    return next();
  res.status(401).json({message: "Access Denied!"});
}


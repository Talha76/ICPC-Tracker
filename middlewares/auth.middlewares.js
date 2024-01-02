const passport = require("passport");

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.status(401).send("Access Denied!<br>Goto <a href='/login'>Login</a> page");
}

exports.isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated())
    return next();
  res.status(401).send("Access Denied!<br>Goto <a href='/profile'>Home</a> page")
}

exports.passportMiddleware = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
}

exports.isFaculty = (req, res, next) => {
  if (req.user.role === "faculty")
    return next();
  res.status(401).json({message: "Access Denied!"});
}


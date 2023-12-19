const passport = require("passport");
const User = require("../models/user.model");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  require("./passport-local.config")(passport);

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error(err);
    }
  });
}


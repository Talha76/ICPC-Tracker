const passport = require("passport");
const User = require("../models/user.model");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  require("./strategies/passport-local.config")(passport);
  require("./strategies/passport-google-oauth")(passport);

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


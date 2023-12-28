const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "pass"
  }, async (email, pass, done) => {
    try {
      const user = await User.findOne({email});
      if (!user)
        return done(null, false, {message: "User not found"});
      if (!user.password)
        return done(null, false, {message: "User did not register with password"});

      const isMatch = bcrypt.compareSync(pass, user.password);
      if (!isMatch)
        return done(null, false, {message: "Incorrect password"});
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}


const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: "id",
    passwordField: "pass"
  }, async (id, pass, done) => {
    try {
      const user = await User.findOne({id});
      if (!user)
        return done(null, false, {message: "User not found"});

      const isMatch = bcrypt.compareSync(pass, user.password);
      if (!isMatch)
        return done(null, false, {message: "Incorrect password"});
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}


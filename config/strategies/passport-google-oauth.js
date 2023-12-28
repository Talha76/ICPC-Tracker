const passport = require("passport");
const User = require("../../models/user.model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({email});
      if (user) return done(null, user);

      user = await User.create({email});
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}


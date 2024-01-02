const User = require("../../models/user.model");

exports.validateEmail = async (req, res, next) => {
  try {
    const {email} = req.body;
    if (!email) {
      req.flash("error", "Email is required");
      return res.redirect("/forgot-pass");
    }

    const user = await User.findOne({email});
    if (!user) {
      req.flash("error", "User with this email does not exist");
      return res.redirect("/forgot-pass");
    }

    next();
  } catch (err) {
    console.error(err);
  }
}


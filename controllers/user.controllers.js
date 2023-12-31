const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const mailer = require("../config/mailer");
const jwt = require("jsonwebtoken");

exports.getUserList = async (req, res) => {
  try {
    const users = await User.find();

    const ret = [];
    for (const user of users) {
      if (user.id === undefined) continue;
      ret.push({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      });
    }

    res.json({
      message: "User list retrieved successfully",
      users: ret
    });
  } catch (err) {
    console.error(err);
  }
}

exports.getUser = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findOne({id});

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/profile");
    }

    const ret = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };

    res.json({
      message: "User retrieved successfully",
      user: ret
    });
  } catch (err) {
    console.error(err);
  }
}

exports.registerUser = async (req, res) => {
  try {
    const {email, pass} = req.body;
    let user = await User.findOne({email});
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/register-user");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    await User.create({
      email,
      password: hash,
    });

    req.flash("success", "User registered successfully");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
}

exports.login = (req, res) => {
  if (!req.user.id)
    return res.redirect("/fill-info");
  res.redirect("/profile");
}

exports.logout = (req, res) => {
  req.logout(() => {});
  req.flash("success", "Logged out successfully");
  res.redirect("/login");
}

exports.fillInfo = async (req, res) => {
  try {
    if (!req.file) {
      req.flash("error", "Please upload an image");
      return res.redirect("/fill-info");
    }
    const {id, name, phone, role} = req.body;
    const image = req.file.filename;

    const user = await User.findById(req.user._id);
    user.id = id;
    user.name = name;
    user.phone = phone;
    user.role = role;
    user.photoPath = image;
    await user.save();

    req.flash("success", "User info filled successfully");
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
  }
}

exports.getProfile = (req, res) => res.render("profile", {user: req.user, error: req.flash("error")});

exports.getFillInfo = (req, res) => res.render("fill-info", {error: req.flash("error")});

exports.forgotPassword = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/forgot-pass");
    }

    const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "5m"});

    const link = `http://localhost:3000/reset-pass?token=${token}`;
    const html = `<p>Click <a href="${link}">here</a> to reset your password</p>`;
    const text = `Click here to reset your password: ${link}`;

    await mailer.sendMail({
      from: "noreply@gmail.com",
      to: email,
      subject: "Password reset",
      html,
      text
    });

    req.flash("success", "Password reset email sent successfully");
    res.redirect("/forgot-pass");
  } catch (err) {
    console.error(err);
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const {token} = req.query;
    const {pass} = req.body;

    console.trace("query:", req.query);
    console.trace("body:", req.body);
    console.trace("params:", req.params);

    const {email} = jwt.verify(token, process.env.JWT_SECRET);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    await User.updateOne({email}, {password: hash});

    req.flash("success", "Password reset successfully");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
}

exports.updateInfo = async (req, res) => {
  try {
    const {name, phone} = req.body;
    const user = await User.findById(req.user._id);
    const filename = req.file ? req.file.filename : user.photoPath;

    console.trace(name, phone);

    user.name = name;
    user.phone = phone;
    user.photoPath = filename;
    await user.save();

    req.flash("success", "User info updated successfully");
    res.redirect("/update-info");
  } catch (err) {
    console.error(err);
  }
}

exports.getIndex = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.id) return res.redirect("/profile");
    return res.redirect("/fill-info");
  }
  res.redirect("/login");
}

exports.getLogin = (req, res) => res.render("login", {
  error: req.flash("error"),
  success: req.flash("success")
});
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
    
    if (!user)
      return res.status(404).json({message: "User not found"});

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
    if (user)
      return res.json({message: "User already exists"});

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    user = await User.create({
      email,
      password: hash,
    });

    res.json({
      message: "User registered successfully",
      user
    });
  } catch (err) {
    console.error(err);
  }
}

exports.login = (req, res) => {
  if (!req.user.id)
    return res.redirect("/fill-info");
  res.json({
    message: "User logged in successfully",
    user: req.user
  });
}

exports.logout = (req, res) => {
  req.logout(() => {});
  res.json({message: "User logged out successfully"});
}

exports.fillInfo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({message: "Invalid file"});
    const {id, name, phone, role} = req.body;
    const image = req.file.filename;

    const user = await User.findById(req.user._id);
    user.id = id;
    user.name = name;
    user.phone = phone;
    user.role = role;
    user.photoPath = image;
    await user.save();

    res.json({message: "User info filled successfully", user});
  } catch (err) {
    console.error(err);
  }
}

exports.getProfile = (req, res) => res.json({message: "User profile retrieved successfully", user: req.user});

exports.getFillInfo = (req, res) => res.sendFile("fill-info.html", {root: "./views"});

exports.changePassword = async (req, res) => {
  try {
    const {oldPass, newPass} = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = bcrypt.compareSync(oldPass, user.password);
    if (!isMatch)
      return res.json({message: "Incorrect old password"});

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPass, salt);
    user.password = hash;
    await user.save();
    res.json({message: "Password changed successfully"});
  } catch (err) {
    console.error(err);
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const {email} = req.body;

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

    res.json({message: "Password reset email sent successfully"});
  } catch (err) {
    console.error(err);
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const {token} = req.query;
    const {pass} = req.body;

    const {email} = jwt.verify(token, process.env.JWT_SECRET);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    await User.updateOne({email}, {password: hash});

    res.json({message: "Password reset successfully"});
  } catch (err) {
    console.error(err);
  }
}

exports.updateInfo = async (req, res) => {
  try {
    const {name, phone} = req.body;
    await User.updateOne({_id: req.user._id}, {name, phone});
    res.json({message: "User info updated successfully"});
  } catch (err) {
    console.error(err);
  }
}

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({message: "Invalid file"});
    const image = req.file.filename;
    await User.updateOne({_id: req.user._id}, {photoPath: image});
    res.json({message: "Avatar uploaded successfully"});
  } catch (err) {
    console.error(err);
  }
}


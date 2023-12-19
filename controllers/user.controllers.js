const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.getUserList = async (req, res) => {
  try {
    const users = await User.find();

    const ret = [];
    for (const user of users) {
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
    const {id, pass, email} = req.body;
    let user = await User.findOne({id});
    if (user)
      return res.json({message: "User already exists"});

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    user = await User.create({
      id,
      password: hash,
      email
    });

    res.json({
      message: "User registered successfully",
      user
    });
  } catch (err) {
    console.error(err);
  }
}

exports.login = (req, res) => res.json({message: "User logged in successfully", user: req.user});

exports.logout = (req, res) => {
  req.logout(() => {});
  res.json({message: "User logged out successfully"});
}

exports.fillInfo = async (req, res) => {
  try {
    const {name, phone, isStudent} = req.body;
    const image = req.file.filename;

    const user = await User.findById(req.user._id);
    user.name = name;
    user.phone = phone;
    user.role = isStudent ? "student" : "teacher";
    user.photoPath = image;
    await user.save();

    res.json({message: "User info filled successfully", user});
  } catch (err) {
    console.error(err);
  }
}

exports.getProfile = (req, res) => res.json({message: "User profile retrieved successfully", user: req.user});


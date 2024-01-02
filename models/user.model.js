const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
  name: String,
  id: Number,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  password: String,
  photoPath: String,
  role: {
    type: String,
    required: true,
    default: "student"
  }
});

module.exports = model("User", UserSchema);


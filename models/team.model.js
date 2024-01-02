const {Schema, model} = require("mongoose");
const User = require("./user.model");

const TeamSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  coach: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }],
    required: true,
    max: 3,
    min: 3,
    unique: true
  },
  photos: [String],
  audios: [String],
  videos: [String]
});

module.exports = model("Team", TeamSchema);


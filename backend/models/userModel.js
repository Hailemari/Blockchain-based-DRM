const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    profile_pic: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    dob : {
      type: Date,
      required: false,
    },
    userType: {
      type: String,
      enum: ["Creator", "Consumer", "Admin"],
      required: false,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

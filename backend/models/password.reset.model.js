const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    min: 255,
  },
  resetString: {
    type: String,
    required: true,
    min: 255,
  },
  createdAt: {
    type: Date,
    required: true,
    min: 255,
  },
  expiresAt: {
    type: Date,
    required: true,
    min: 255,
  },
});

module.exports = mongoose.model("PasswordReset", PasswordResetSchema);
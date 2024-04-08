const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileDescription: { type: String, required: true }, // Added file description field
  ownerName: { type: String, required: true },
  dateCreated: { type: Date, required: true },
  dateAdded: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  contentType: { type: String, required: true },
  data: { type: String, required: true } // Base64 encoded data
});

module.exports = mongoose.model('File', fileSchema);

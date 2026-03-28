const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: String,
  phoneNo: String,
  landArea: Number,
  location: { state: String, district: String },
  caste: String,
  annualIncome: Number,
  deviceType: String
});

module.exports = mongoose.model('Farmer', farmerSchema);
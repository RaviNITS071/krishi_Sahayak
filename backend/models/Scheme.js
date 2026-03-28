const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: String,
  description: String,
  benefits: String,
  requiredDocuments: [String],
  applyLink: String,
  cscCharges: Number,
  deadline: Date,
  priorityScore: Number,
  eligibility: Object
});

module.exports = mongoose.model('Scheme', schemeSchema);
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: String,
  body: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('News', schema);
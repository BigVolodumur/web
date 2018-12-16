const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  author: String,
  title: String,
  body: String,
}, {
  timestamps: true
})

module.exports = mongoose.model('Feedback', schema);
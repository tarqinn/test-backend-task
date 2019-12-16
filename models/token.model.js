const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    require: true
  },
  userId: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('token', TokenSchema);
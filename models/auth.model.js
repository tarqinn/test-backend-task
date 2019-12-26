const mongoose = require('mongoose');

const SiteUserSchema = new mongoose.Schema({
  login: {
    type: String,
    require: true,
    default: ''
  },
  pass: {
    type: String,
    require: true,
    default: ''
  },
  role: {
    type: String,
    require: true,
    default: 'user'
  }
});

module.exports = mongoose.model('siteUser', SiteUserSchema);

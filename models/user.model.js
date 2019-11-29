const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    checked: {
      type: Boolean,
      require: true,
      default: false
    },
    userId: {
      type: Number,
      require: true,
      default: 0
    },
    firstName: {
      type: String,
      require: true,
      default: ''
    },
    lastName: {
      type: String,
      require: true,
      default: ''
    },
    login: {
      type: String,
      require: false,
      default: ''
    },
    workPhone: {
      type: String,
      require: true,
      default: ''
    },
    personalPhone: {
      type: String,
      require: false,
      default: ''
    },
    workEmail: {
      type: String,
      require: true,
      default: ''
    },
    personalEmail: {
      type: String,
      require: false,
      default: ''
    },
    businessLocation: {
      type: String,
      require: true,
      default: ''
    },
    company: {
      type: String,
      require: true,
      default: ''
    },
    role: {
      type: String,
      require: true,
      default: ''
    },
    hourlyRate: {
      type: Number,
      require: true,
      default: 0
    }
  },
  { versionKey: false, timestamp: true }
);

module.exports = mongoose.model('employee', UserSchema);

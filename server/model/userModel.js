// MODULES
const mongoose = require('mongoose');

// INITS
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30
  },
  email: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 200,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

// EXPORT
module.exports = User;
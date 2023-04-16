// MODULES
const mongoose = require('mongoose');

// INITS
const chatSchema = new mongoose.Schema({
  members: Array
}, {
  timestamps: true
});

const Chat = mongoose.model("Chat", chatSchema);

// EXPORT
module.exports = Chat;
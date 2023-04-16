// MODULES 
const mongoose = require('mongoose');

// INITS
const messageSchema = new mongoose.Schema({
  chatId: String,
  senderId: String,
  text: String
}, {
  timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

// EXPORT
module.exports = Message;
// MODULES
const express = require('express');
const { createMessage, getMessages } = require('../controller/messageController');

// INITS
const router = express.Router();

// Routes config
router.post('/', createMessage);
router.get('/:chatId', getMessages);

// EXPORT
module.exports = router;
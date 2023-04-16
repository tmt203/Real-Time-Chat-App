// MODULES 
const express = require('express');
const {createChat, findUserChats, findChat} = require('../controller/chatController');

// INITS
const router = express.Router();

// Routes config
router.post('/', createChat);
router.get('/:userId', findUserChats);
router.get('/find/:firstId/:secondId', findChat);


// EXPORT
module.exports = router;
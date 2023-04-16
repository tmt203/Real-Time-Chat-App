// MODULES
const express = require('express');
const { registerUser, loginUser, findUser, getUsers } = require('../controller/userController');

// INITS
const router = express.Router();

// Router config
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/find/:userId', findUser);
router.get('/', getUsers);
 
// EXPORT
module.exports = router;
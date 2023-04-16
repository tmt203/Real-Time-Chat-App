// MODULES
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../model/userModel');


// INITS

const createToken = (_id) => {
  const key = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, key, { expiresIn: '3d' });
}

const registerUser = async (req, res) => {
  try {
    // Get req.body data
    const { name, email, password, confirmPassword } = req.body;

    // Validation data
    let user = await User.findOne({ email });

    if (user)
      return res.status(400).json('User with the given email already existed');

    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json('All fields are required');

    if (!validator.isEmail(email))
      return res.status(400).json('Email must be a valid email');

    if (!validator.isStrongPassword(password))
      return res.status(400).json('Password must be a strong password');

    if (confirmPassword !== password)
      return res.status(400).json('Confirm password must be same');

    // Create new user
    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // Create token
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
};

const loginUser = async (req, res) => {
  try {
    // Get req.body data
    const { email, password } = req.body;

    // Validation
    if (!email || !password)
      return res.status(400).json('All fields are required');

    let user = await User.findOne({ email });

    if (!user)
      return res.status(400).json('Invalid email or password');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json('Invalid email or password');

    // Create token
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select('-password');


    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find().select('-password');

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// EXPORT
module.exports = { registerUser, loginUser, findUser, getUsers };
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config');

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, userType, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, userType: user.userType }, config.secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Authentication successful', token, userType: user.userType });
  } catch (error) {
    next(error);
  }
};


exports.getUsers = async (req, res, next) => {
  try {
    console.log('Fetching users');
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};


exports.removeUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    next(error);
  }
};


exports.updateUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    // Save the updated user
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
  console.log('new request');

  // Extract the Authorization header
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Verify that the Authorization header follows the 'Bearer <token>' format
  const tokenMatch = authHeader.match(/^Bearer\s+(\S+)$/);

  if (!tokenMatch) {
    return res.status(401).json({ message: 'Invalid Authorization header format' });
  }

  // Extract the token from the match
  const token = tokenMatch[1];

  let userId;
  try {
    // Verify the token
    console.log(config.secretKey)
    const decoded = jwt.verify(token, 'usmael'); // Use the secret key from config
    console.log('Decoded:', decoded);
    userId = decoded.userId; // Extract the userId from the decoded token
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }

  const { firstName, lastName, email } = req.body;

  try {
    const user = await User.findById(userId);
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }
    }

    // Update user details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    // Save the updated user
    await user.save();

    console.log('User updated:', user);
    return res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
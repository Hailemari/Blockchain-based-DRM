const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const resetPasswordTemplate = require('../utils/template/passwordrestemplate');


// exports.signup = async (req, res, next) => {
//   try {
//     const { firstName, lastName, email, password, userType } = req.body;

//     if (!password) {
//       return res.status(400).json({ message: 'Password is required' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ firstName, lastName, email, userType, password: hashedPassword });
//     res.status(201).json({ message: 'User created successfully', user });
//   } catch (error) {
//     next(error);
//   }
// };

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

    const user = await User.create({ firstName, lastName, email, password, userType });

    const token = user.getSignedToken();
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    next(error);
  }
};


// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ userId: user._id, userType: user.userType }, config.secretKey, { expiresIn: '1h' });
//     console.log('User logged in:', user);

//     res.status(200).json({ message: 'Authentication successful', token, userType: user.userType });
//   } catch (error) {
//     next(error);
//   }
// };

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Ensure password is selected when fetching the user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user);
    console.log('Entered password:', password);
    console.log('Stored password:', user.password);

    const isPasswordValid = await user.matchPasswords(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.getSignedToken();
    const userType = user.userType;
    const resetp = user.resetPasswordToken;

    console.log('User logged in, reset token:', resetp);
    console.log('User logged in, user type:', userType);

    res.status(200).json({ message: 'Authentication successful', token, userType });
  } catch (error) {
    console.error('Error during login:', error);
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

exports.saveProfilePic = async (req, res) => {
  try {
    const { userId } = req.query;
    const picParams = {
      Bucket: "drm-profile",
      Key: `pic/${userId}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };
    // console.log(`Uploading to bucket : ${picParams.Bucket}, Key : ${picParams.Key}`);

    const uploadedFile = await s3.upload(picParams).promise();
    const pictureUrl = uploadedFile.Location;

    console.log(pictureUrl);

    res.status(200).send({
      status: true,
      message: "Profile pic saved",
      data: pictureUrl,
    });
    userRes = await User.findByIdAndUpdate(userId, { profile_pic: pictureUrl },{new : true})
  } catch (error) {
    logger.info(error);
    res.status(400).send({
      status: false,
      message: "Failed to save profile pic",
      error: error.message,
    });
  }
};
exports.updateUserProfile = async (req, res) => {
  // const email = req.user._id;
  const { firstName, lastName, dob, phone, email } = req.body;
  try {
    const userRes = await User.findOne({ email: email });
    if (!userRes) {
      return res.status(403).send({
        status: false,
        message: "User profile not exist",
      });
    }

    if (firstName) {
      userRes.firstName = firstName;
    }
    if (lastName) {
      userRes.lastName = lastName;
    }
    if (dob) {
      userRes.dob = dob;
    }
    if (phone) {
      userRes.phone = phone;
    }

    await userRes.save();
    res.status(200).send({
      status: true,
      message: "User profile updated successfully",
      data: userRes,
    });
  } catch (error) {
    console.log(error)
 
    res.status(400).send(error);
  }
};

// user profile
exports.getUser = async (req, res) => {

  try {
    // Query the database to find the user by their unique _id
    const user = await User.findById(req.user.id); // Exclude the password field from the returned document

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is found, respond with the user object
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logout successful' });
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    return next(new Error("Please provide email"));
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      return next(new Error("User does not exist"));
    }

    // Generate reset token and save it to user
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:5173/passwordreset/${resetToken}`;
    const message = resetPasswordTemplate(resetUrl);

    try {
      // Send email
       sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });

      return res.status(200).json({
        success: true,
        message: "Email was sent!",
      });
    } catch (error) {
      // If email sending fails, handle the error and clean up reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error("Email sending failed:", error);
      res.status(500);
      return next(new Error("Email could not be sent"));
    }
  } catch (error) {
    // Handle other potential errors (e.g., database errors)
    console.error("Forgot password error:", error);
    next(error);
  }
};

exports. resetPassword = async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    res.status(400);
    return next(new Error("Please provide new password"));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      return next(new Error("Invalid Reset Token"));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      message: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.generateToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  return res.status(statusCode).json({
    success: true,
    token,
  });
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config');
const ValidateEmail = require('../utils/validation/emailValid');
const userPasswordReset = require('../models/password.reset.model');

const signup = async (req, res, next) => {
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
    const user = await User.create({ firstName, lastName, email, userType, password: hashedPassword }); // Here
    console.log(user);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};


// const signup = async (req, res) => {
//   try {
//     const { email, password, firstName, lastName } = req.body;
//     const checkValid = ValidateEmail(email);
//     if (!checkValid) {
//       return res.status(200).send({
//         status: false,
//         inValidEmail: true,
//         message: "Enter a valid email address",
//       });
//     }
//     const response = await user.findOne({ email }).exec();
//     if (response) {
//       return res.status(200).send({
//         status: false,
//         message: `User already registered with ${email}`,
//       });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newUser = new user({
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       password: hashedPassword,
//       // provider: "email",
//     }).save();
    
//   } catch (error) {
//     logger.info(error);
//     res.status(403).send(error);
//   }
// };
const login = async (req, res, next) => {
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

// requestPasswordReset
const requestPasswordReset = async (req, res) => {
  const { email, redirectUrl } = req.body;
  const checkValid = ValidateEmail(email);
  if (!checkValid) {
    return res.status(200).send({
      status: false,
      message: "Enter a valid email address",
    });
  }
  User
    .find({ email })
    .then((data) => {
      if (data.length) {
        // check if user is verified
        if (!data[0].email_verify) {
          // res.json({
          //   status: false,
          //   message: "Email has't been verified yet. Check your inbox",
          // });
        } else {
          // proceed with email to reset password
          sendResetEmail(data[0], redirectUrl, res);
        }
      } else {
        return res.json({
          status: false,
          message: `User not found by ${email}`,
        });
      }
    })
    .catch((err) => {
      logger.info(err);
      res.status(400).send({
        status: "FAILED",
        message: "An error occurred while checking for existing user",
      });
    });
};

// send password reset email
const sendResetEmail = ({ _id, email }, redirectUrl, res) => {
  const resetString = uuidv4() + _id;

  userPasswordReset
    .deleteMany({ userId: _id })
    .then((result) => {
      // Reset records deleted successfully

      //Now send email

      const link =
        redirectUrl + "?userId=" + _id + "&resetString=" + resetString;
      const resetPasswordHtml = htmlResetPasswordTemplate(link);
      // mail options
      const mailOptions = {
        from: {
          name: "DRM",
          address: process.env.AUTH_EMAIL,
        },
        to: email,
        subject: "Reset Your DRM Password",
        html: resetPasswordHtml,
      };
      // hash the reset string
      const saltRounds = 10;
      bcrypt
        .hash(resetString, saltRounds)
        .then((hashedResetString) => {
          const newPasswordReset = new userPasswordReset({
            userId: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
          });
          newPasswordReset
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  // reset email sent and password reset record saved
                  res.send({
                    status: true,
                    email: email,
                    message: "Password reset email sent",
                  });
                })
                .catch((err) => {
                  logger.info(err);
                  res.status(200).send({
                    status: false,
                    message: "Password reset email failed to sent",
                  });
                });
            })
            .catch((err) => {
              logger.info(err);
              res.status(200).send({
                status: "FAILED",
                message: "Couldn't save password reset data!",
              });
            });
        })
        .catch((error) => {
          logger.info(error);
          res.status(200).send({
            status: "FAILED",
            message: "An error occurred while hashing the password reset data",
          });
        });
    })
    .catch((error) => {
      logger.info(error);
      res.status(200).send({
        status: "FAILED",
        message: "Clearing existing password reset records failed",
      });
    });
};

// reset password
const resetPassword = async (req, res) => {
  let { userId, resetString, newPassword } = req.body;
  if (!userId || !resetString || !newPassword) {
    return res.json({
      status: false,
      message: "userId or resetString and new password is missing",
    });
  }

  userPasswordReset
    .find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // if exists
        const { expiresAt } = result[0];
        const hashedResetString = result[0].resetString;
        // checl expire
        if (expiresAt < Date.now()) {
          userPasswordReset
            .deleteOne({ userId })
            .then(() => {
              res.json({
                status: false,
                message: "Password reset link has expired",
              });
            })
            .catch((err) => {
              logger.info(err);
              res.json({
                status: false,
                message: "Password reset request not found",
              });
            });
        } else {
          // valid reset record exist
          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              if (result) {
                // string matched
                // hash password again
                const saltRounds = 10;
                bcrypt
                  .hash(newPassword, saltRounds)
                  .then((hashedNewPassword) => {
                    //update user password
                    User
                      .updateOne(
                        { _id: userId },
                        { password: hashedNewPassword }
                      )
                      .then(() => {
                        // update complete,Now delete reset record
                        userPasswordReset
                          .deleteOne({ userId })
                          .then(() => {
                            // both usser record and reset record updated
                            res.json({
                              status: true,
                              message: "Password has been updated successfully",
                            });
                          })
                          .catch((error) => {
                            logger.info(error);
                            res.json({
                              status: "FAILED",
                              message:
                                "An error occurred while finalizing password reset",
                            });
                          });
                      })
                      .catch((err) => {
                        logger.info(err);
                        res.json({
                          status: "FAILED",
                          message: "Updating user password failed",
                        });
                      });
                  })
                  .catch((error) => {
                    logger.info(error);
                    res.json({
                      status: "FAILED",
                      message: "An error occurred while hashing new password",
                    });
                  });
              } else {
                // Exisitinf record but incorrect reset string passed
                res.json({
                  status: false,
                  message: "Invalid password reset details passed",
                });
              }
            })
            .catch((error) => {
              res.json({
                status: "FAILED",
                message: "Comparing password reset strings failed",
              });
            });
        }
      } else {
        // password reset record doesn't exist
        res.json({
          status: false,
          message: "Password reset request not found",
        });
      }
    })
    .catch((error) => {
      logger.info(error);
      res.json({
        status: "FAILED",
        message: "Clearing existing password reset records failed",
      });
    });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const isUser = await User.findById(req.user._id);
    const validPass = bcrypt.compare(currentPassword, isUser.password);
    validPass.then(async (result) => {
      if (!result) {
        return res.send({
          status: false,
          PasswordField: "old",
          message: "Current password is incorrect.",
        });
      } else if (newPassword !== confirmNewPassword) {
        return res.send({
          status: false,
          PasswordField: "new",
          message: "password does not matched.",
        });
      } else if (newPassword.length < 6 || confirmNewPassword < 6) {
        return res.send({
          status: false,
          PasswordField: "new",
          message: "Passwords must have at least 6 characters long",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        isUser.password = hashedPassword;
        isUser.save();
        return res.send({
          status: true,
          _id: isUser._id,
          message: "Password updated successfully.",
        });
      }
    });
  } catch (err) {
    res.json({
      status: false,
      message: err,
    });
  }
};



module.exports = {
  signup,
  login,
  requestPasswordReset,
  resetPassword,
  changePassword,
}
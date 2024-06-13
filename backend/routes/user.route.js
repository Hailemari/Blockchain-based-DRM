const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profile.controller');
const router = express.Router();
const multerMiddleware = require('../middleware/multer');
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/requestPasswordReset', userController.requestPasswordReset);
router.post('/resetPassword',userController.resetPassword);
router.post('/updatePassword', userController.changePassword);
router.post('/updateProfile', profileController.updateUserProfile);
router.get('/profile', profileController.getUserProfile);

// save user pic
router.post(
  "/saveProfilePic",
  multerMiddleware.single("file"),
  profileController.saveProfilePic
);


// router.get('/logout', authMiddleware.authenticate, userController.logout);

// router.get('/google', userController.googleAuth);
// router.get('/google/callback', userController.googleAuthCallback);

// router.get('/facebook', userController.facebookAuth);
// router.get('/facebook/callback', userController.facebookAuthCallback);

module.exports = router;


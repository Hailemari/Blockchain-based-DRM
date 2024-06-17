const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.delete('/users/:userId', authController.removeUser);
router.get('/profile',authMiddleware.authenticate, authController.getUser);
router.put('/update-profile', authMiddleware.authenticate,authController.updateUser);
router.post('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:resetToken', authController.resetPassword);

module.exports = router;

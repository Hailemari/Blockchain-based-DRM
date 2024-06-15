const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.delete('/users/:userId', authController.removeUser);
router.put('/update', authController.updateUser);



module.exports = router;

const express = require("express");
const router = express.Router();

const userRoute = require('./routes/user.route');
const errorHandler = require('./utils/errorHandler');
const fileRoutes = require('./routes/fileRoutes'); // Import file routes
const adminRoutes = require('./routes/adminRoute');

router.use('/admin', adminRoutes);
router.use('/user', userRoute);
router.use('/api/files', fileRoutes); // Use file routes


module.exports = router;
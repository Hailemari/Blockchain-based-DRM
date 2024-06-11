const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/userModel'); 

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash('haila@19', 10);

    const adminUser = new User({
      userType: 'Admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gmail.com',
      password: hashedPassword,
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.disconnect();
  }
};

createAdminUser();

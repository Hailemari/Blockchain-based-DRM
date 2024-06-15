const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const process = require('process'); // Import the 'process' module
const routes = require("./route.index");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
  // app.use(session({
//   secret: 'usmael',
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());


// app.use('/admin', adminRoutes);
// app.use('/auth', userRoute);
// app.use('/api/files', fileRoutes); // Use file routes
app.use(routes);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err.message));
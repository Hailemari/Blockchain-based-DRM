exports.getDashboard = (req, res, next) => {
    try {
      res.status(200).json({ message: 'Welcome to the Admin Dashboard' });
    } catch (error) {
      next(error);
    }
  };
  
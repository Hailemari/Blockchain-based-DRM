// const jwt = require('jsonwebtoken');
// const config = require('../config/config');

// exports.authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication failed: No token provided' });
//   }

//   jwt.verify(token, config.secretKey, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Authentication failed: Invalid token' });
//     }

//     req.user = decoded;
//     next();
//   });
// };
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Authentication failed: Token expired' });
      }
      return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }

    req.user = decoded; // Attach decoded user information to req.user
    next();
  });
};

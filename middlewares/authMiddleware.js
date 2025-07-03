const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    userModel.findUserById(decoded.id, (err, user) => {
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = { id: user.id, email: user.email };
      next();
    });
  });
};

module.exports = authMiddleware; 
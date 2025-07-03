const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const signup = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  userModel.findUserByEmail(email, (err, user) => {
    if (user) return res.status(409).json({ message: 'Email already exists' });
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });
      userModel.createUser(name, email, hash, (err, userId) => {
        if (err) return res.status(500).json({ message: 'Error creating user' });
        res.status(201).json({ id: userId, name, email });
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'All fields required' });
  userModel.findUserByEmail(email, (err, user) => {
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    });
  });
};

module.exports = { signup, login }; 
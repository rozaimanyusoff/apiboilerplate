const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../../config');

const register = (req, res) => {
  const { username, email, password } = req.body;

  // Check if the username or email already exists
  User.findByUsername(username, (err, existingUser) => {
    if (err) return res.status(500).send('Error checking username');
    if (existingUser) return res.status(400).send('Username already exists');

    User.findByEmail(email, (err, existingEmail) => {
      if (err) return res.status(500).send('Error checking email');
      if (existingEmail) return res.status(400).send('Email already exists');

      const hashedPassword = bcrypt.hashSync(password, 8);

      User.create({ username, email, password: hashedPassword }, (err, result) => {
        if (err) return res.status(500).send('Error registering user');
        res.status(201).send('User registered successfully');
      });
    });
  });
};

const login = (req, res) => {
  const { identifier, password } = req.body;

  User.findByEmailOrUsername(identifier, (err, results) => {
    if (err || results.length === 0) return res.status(404).send('User not found');

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) return res.status(401).send('Invalid password');

    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: 86400 });
    res.status(200).send({ auth: true, token });
  });
};

const changePassword = (req, res) => {
  const { userId } = req;
  const { oldPassword, newPassword } = req.body;

  User.findById(userId, (err, user) => {
    if (err || !user) return res.status(404).send('User not found');

    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid) return res.status(401).send('Invalid old password');

    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    user.password = hashedPassword;

    user.save((err) => {
      if (err) return res.status(500).send('Error updating password');
      res.status(200).send('Password updated successfully');
    });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err || !user) return res.status(404).send('User not found');

    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: 3600 }); // 1 hour expiry
    // Send token to user's email (implementation depends on your email service)
    res.status(200).send('Password reset token sent to email');
  });
};

const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    User.findById(decoded.id, (err, user) => {
      if (err || !user) return res.status(404).send('User not found');

      const hashedPassword = bcrypt.hashSync(newPassword, 8);
      user.password = hashedPassword;

      user.save((err) => {
        if (err) return res.status(500).send('Error resetting password');
        res.status(200).send('Password reset successfully');
      });
    });
  } catch (err) {
    res.status(401).send('Invalid or expired token');
  }
};

module.exports = { register, login, changePassword, forgotPassword, resetPassword };
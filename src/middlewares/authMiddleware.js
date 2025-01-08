const jwt = require('jsonwebtoken');
const config = require('../../config');
const logActivity = require('../utils/logger');

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    logActivity('No token provided');
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded.exp < Date.now() / 1000) {
      logActivity('Token expired');
      return res.status(401).send('Token expired');
    }
    req.userId = decoded.id;
    req.tokenInfo = decoded; // Store the entire decoded token information
    logActivity(`Token verified for user ID: ${req.userId}`);
  } catch (err) {
    logActivity('Invalid token');
    return res.status(401).send('Invalid Token');
  }
  return next();
};

module.exports = verifyToken;
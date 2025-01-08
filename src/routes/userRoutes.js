// filepath: src/routes/userRoutes.js
const express = require('express');
const { register, login, changePassword, forgotPassword, resetPassword } = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { ApiError, SECRET_KEY } = require('../config');

const router = express.Router();
const User = require('../models');

router.get('/good', (_, res) => res.json({
  statusCode: 200,
  message: 'ok',
}));
router.get('/failed', (_, res) => res.json({
  statusCode: 400,
  message: 'Invalid credential',
}));
// Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  async (req, res, next) => {
    const { email } = req.user;
    const fullName = req.user.displayName;
    try {
      const foundData = await User.findOne({ where: { email } });
      if (!foundData) {
        const data = await User.create({ email, fullName });
        const token = await jwt.sign({ id: data.id }, SECRET_KEY);
        return res.status(200).json({
          statusCode: 200, message: 'login successfull', token,
        });
      }
      const token = await jwt.sign({ id: foundData.id }, SECRET_KEY);
      return res.status(201).json({
        statusCode: 200, message: 'login successfull', token,
      });
    } catch (err) {
      return next(new ApiError(400, err.message));
    }
  },
);
module.exports = router;

import express from 'express';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { ApiError, SECRET_KEY } from '../config';

const router = express.Router();
const { user } = require('../db/models');

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
  async (req: any, res, next) => {
    const { email } = req.user;
    const fullName = req.user.displayName;
    try {
      const foundData = await user.findOne({ where: { email } });
      if (!foundData) {
        const data = await user.create({ email, fullName });
        const token = await jwt.sign({ id: data.id }, SECRET_KEY);
        return res.status(200).json({
          statusCode: 200, message: 'login successfull', token,
        });
      }
      const token = await jwt.sign({ id: foundData.id }, SECRET_KEY);
      return res.status(201).json({
        statusCode: 200, message: 'login successfull', token,
      });
    } catch (err: any) {
      return next(new ApiError(400, err.message));
    }
  },
);
export default router;

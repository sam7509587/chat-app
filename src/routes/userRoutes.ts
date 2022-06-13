/* eslint-disable import/no-unresolved */
import express from 'express';
import {
  allUser, login, verfiyOtp, addFullName, logout,
} from '../controller';
import { verifyToken } from '../middleware';
import { userValidition } from '../validation';

const router = express.Router();

router.route('/')
  .post(userValidition, login)
  .get(verifyToken, allUser);
router.post('/verify', verfiyOtp);
router.post('/profile', addFullName);
router.get('/logout', verifyToken, logout);
export default router;

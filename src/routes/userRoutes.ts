/* eslint-disable import/no-unresolved */
import express from 'express';
import { allUser, login } from '../controller';
import { verifyToken } from '../middleware';
import { userValidition } from '../validation';

const router = express.Router();

router.route('/')
  .post(userValidition, login)
  .get(verifyToken, allUser);
export default router;

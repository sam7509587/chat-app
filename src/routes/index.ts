/* eslint-disable import/no-unresolved */

import express from 'express';
import userRoutes from './userRoutes';
import conversationRoutes from './conersation';
import messageRoutes from './message';
import googleRoutes from './google';
import { indexPage } from '../controller';

const router = express.Router();
router.get('/', indexPage);
router.use('/', googleRoutes);
router.use('/user', userRoutes);
router.use('/friend', conversationRoutes);
router.use('/message', messageRoutes);
router.use('*', (_, res: any) => {
  res.status(404).json({
    statusCode: 404,
    message: 'no route found',
  });
});
export = router;

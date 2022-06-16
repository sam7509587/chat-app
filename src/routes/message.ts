import express from 'express';
import { showMessage, sendMessage } from '../controller/message';
import { verifyToken } from '../middleware';
import { validateId } from '../validation';

const router = express.Router();
router
  .route('/:id')
  .post(validateId, verifyToken, sendMessage)
  .get(verifyToken, validateId, showMessage);
export default router;

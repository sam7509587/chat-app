import express from 'express';
import {
  acceptRequest,
  rejectRequest,
  seeFriend,
  seeRequests,
  sendRequest,
} from '../controller';
import { verifyToken } from '../middleware';
import { validateId } from '../validation';

const router = express.Router();
router.get('/friendList', verifyToken, seeFriend);
router.route('/:id').get(validateId, verifyToken, sendRequest);

router.get('/accept/:id', validateId, verifyToken, acceptRequest);

router.get('/reject/:id', validateId, verifyToken, rejectRequest);

router.get('/', verifyToken, seeRequests);
export default router;

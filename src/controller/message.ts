/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import * as Sequelize from 'sequelize';
import { v4 as UUID } from 'uuid';
import { ApiError } from '../config';
import { getFriends, MsgById } from '../services';

const { conversation, message } = require('../db/models');

const { Op } = Sequelize;
export const sendMessage = async (
  req: any,
  res: any,
  next: any,
) => {
  const { id } = req.params;
  let { message: messageToSend } = req.body;
  messageToSend = messageToSend.trim();
  const { user: currUser } = req;
  try {
    const io = req.app.get('io');
    const ids = [id, currUser.id];
    const requestFound = await conversation.findOne({
      where: {
        status: 'accepted',
        sender: { [Op.or]: ids },
        receiver: { [Op.or]: ids },
      },
    });
    const data = await message.create({
      id: UUID(),
      to: id,
      from: req.user.id,
      message: messageToSend,
      conversationId: requestFound.id,
    });
    io.emit('chat message', { receiverId: id, senderId: currUser.id, message: messageToSend });
    const users = await getFriends(currUser);
    const messagesData = await MsgById(currUser, id);
    const { msg, otherUser } = messagesData;
    return res.render('dashboard', {
      msg, data: users, user: currUser, otherUser,
    });
  } catch (err: any) {
    return next(new ApiError(400, err.message));
  }
};

export const showMessage = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { id: senderId } = req.params;
    const { user: currUser } = req;
    const users = await getFriends(currUser);
    const messagesData = await MsgById(currUser, senderId);
    const { msg, otherUser } = messagesData;
    return res.render('dashboard', {
      msg, data: users, user: currUser, otherUser,
    });
  } catch (err: any) {
    return next(new ApiError(400, err.message));
  }
};

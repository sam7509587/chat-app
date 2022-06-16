/* eslint-disable import/no-unresolved */
import { v4 as UUID } from 'uuid';
import * as Sequelize from 'sequelize';
import { ApiError } from '../config';
import { getFriends } from '../services';

const { conversation, user } = require('../db/models');

const { Op } = Sequelize;

export const sendRequest = async (req: any, res: any, next: any) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user.id;
    const ids = [receiverId, senderId];
    const findConversaton = await conversation.findOne({
      where: {
        sender: { [Op.or]: ids },
        receiver: { [Op.or]: ids },
      },
    });
    if (findConversaton) {
      await conversation.destroy({
        where: {
          sender: { [Op.or]: ids },
          receiver: { [Op.or]: ids },
        },
      });
      return next(new ApiError(400, 'already sent Request'));
    }
    const requestSent = await conversation.create({
      id: UUID(),
      sender: senderId,
      receiver: receiverId,
    });
    req.app
      .get('io')
      .emit('send request', { receiver: receiverId, sender: senderId });
    return res.status(200).json({
      statusCode: 200,
      message: 'request sent',
      requestSent,
    });
  } catch (err: any) {
    return next(new ApiError(400, err.message));
  }
};
export const seeRequests = async (req: any, res: any, next: any) => {
  try {
    const { search = '' } = req.query;
    const { id } = req.user;
    const data = await conversation.findAll({
      where: {
        receiver: id,
        status: 'pending',
      },
      include: [
        {
          model: user,
          as: 'sentFrom',
          where: { fullName: { [Op.iLike]: `%${search}%` } },
          attributes: ['fullName', 'id'],
        },
      ],
    });
    return res
      .status(200)
      .json({ statusCode: 200, message: 'users found', data });
  } catch (err: any) {
    return next(new ApiError(400, err.message));
  }
};
export const rejectRequest = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    await conversation.destroy({
      where: {
        sender: id,
        receiver: req.user.id,
      },
    });
    return res.status(200).json({
      statusCode: 200,
      message: 'request rejected',
    });
  } catch (err: any) {
    return next(new ApiError(400, err.message));
  }
};
export const acceptRequest = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    await conversation.update(
      { status: 'accepted' },
      { where: { sender: id, receiver: req.user.id } },
    );
    return res.status(200).json({
      statusCode: 200,
      message: 'request rejected',
    });
  } catch (err: any) {
    return next(new ApiError(400, err.message));
  }
};
export const seeFriend = async (req: any, res: any) => {
  try {
    const friends = await getFriends(req.user);
    return res.json({ data: friends });
  } catch (err) {
    return console.log(err);
  }
};

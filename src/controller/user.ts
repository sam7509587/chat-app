/* eslint-disable import/no-unresolved */
import bcrypt from 'bcrypt';
import { v4 as UUID } from 'uuid';
import jwt from 'jsonwebtoken';
import * as Sequelize from 'sequelize';
import { ApiError, SECRET_KEY } from '../config';
import { getFriends, notFriends } from '../services';

const { user, conversation } = require('../db/models');

export const indexPage = async (req:any, res:any) => {
  const token = req.headers.cookie.split('=')[1];
  if (!token) {
    return res.render('login');
  }
  const verifyToken:any = await jwt.verify(
    token,
    SECRET_KEY,
  );
  const userFound = await user.findOne({ where: { id: verifyToken.id } });
  const data = await getFriends(userFound);
  const msg :any = [];
  const otherUser:any = {};
  otherUser.id = 'none';
  const allotherUsers = await notFriends(userFound);
  return res.render('dashboard', {
    data, msg, otherUser, allotherUsers, user: userFound,
  });
};
export const login = async (req: any, res: any) => {
  const { email, password, fullName } = req.body;
  try {
    const userFound = await user.findOne({ where: { email } });
    if (!userFound) {
      if (fullName.length === 0) {
        return res.render('index', { err: 'full name is required' });
      }
      const bcryptPass = await bcrypt.hash(password, 10);
      const userCreated = await user.create({
        id: UUID(),
        email,
        password: bcryptPass,
        fullName,
      });
      const token = await jwt.sign({ id: userCreated.id }, SECRET_KEY);
      const data = await getFriends(userCreated);
      const msg :any = [];
      const otherUser:any = {};
      otherUser.id = 'none';
      const allotherUsers = await notFriends(userCreated);
      return res.cookie('access_token', token, {
        httpOnly: true,
      }).render('dashboard', {
        data, msg, otherUser, allotherUsers, user: userCreated,
      });
    }
    const matchPass = await bcrypt.compare(password, userFound.password);
    if (!matchPass) {
      return res.render('index', { err: 'email or password is wrong' });
    }
    const token = await jwt.sign({ id: userFound.id }, SECRET_KEY);
    const data = await getFriends(userFound);
    const msg :any = [];
    const otherUser:any = {};
    otherUser.id = 'none';
    const allotherUsers = await notFriends(userFound);
    return res.cookie('access_token', token, {
      httpOnly: true,
    }).render('dashboard', {
      data, msg, otherUser, allotherUsers, user: userFound,
    });
  } catch (err: any) {
    return res.render('index', { err: err.message });
  }
};
export const allUser = async (req: any, res: any, next: any) => {
  try {
    const { search = '' } = req.query;
    const { Op } = Sequelize;
    const { id } = req.user;
    const findBockedUsers = await conversation.findAll({
      where: { [Op.or]: [{ sender: id }, { receiver: id }] },
    });
    let blockedIds;
    if (findBockedUsers) {
      const blockedUser = findBockedUsers.map((ids: { sender: any; receiver: any; }) => {
        const a: any = [];
        if (ids.sender === id) {
          a.push(ids.receiver);
        }
        if (ids.receiver === id) {
          a.push(ids.sender);
        }
        return a;
      });
      blockedIds = blockedUser.flat(1);
      blockedIds.push(id);
    } else {
      blockedIds = [id];
    }
    const data = await user.findAll({
      where: {
        fullName: {
          [Op.iLike]: `%${search}%`,
        },
        id: { [Op.notIn]: blockedIds },
      },
      attributes: ['fullName', 'id', 'email'],
    });
    return res.status(200).json({
      statusCode: 200,
      message: 'users found',
      total: data.length,
      data,
    });
  } catch (e: any) {
    return next(new ApiError(400, e.message));
  }
};

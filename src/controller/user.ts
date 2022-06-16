/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-unresolved */
import bcrypt from 'bcrypt';
import { v4 as UUID } from 'uuid';
import jwt from 'jsonwebtoken';
import * as Sequelize from 'sequelize';
import { ApiError, SECRET_KEY } from '../config';
import { getFriends, notFriends } from '../services';
import { sendOtpMail } from '../services/mail';

const { user, conversation } = require('../db/models');

export const indexPage = async (req: any, res: any) => {
  let token;
  if (req.headers.cookie) {
    token = req.headers.cookie.split('=')[1];
  }
  if (!token) {
    return res.render('index', { err: 'you are not logged in' });
  }
  const verifyToken: any = await jwt.verify(token, SECRET_KEY);
  const userFound = await user.findOne({ where: { id: verifyToken.id } });
  const data = await getFriends(userFound);
  const msg: any = [];
  const otherUser: any = {};
  otherUser.id = 'none';
  const allotherUsers = await notFriends(userFound);
  return res.render('dashboard', {
    data,
    msg,
    otherUser,
    allotherUsers,
    user: userFound,
  });
};
export const login = async (req: any, res: any) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const userFound = await user.findOne({ where: { email } });
    if (!userFound) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExp = new Date(new Date().getTime() + 5 * 60000);
      const bcryptPass = await bcrypt.hash(password, 10);
      await user.create({
        id: UUID(),
        otp,
        email,
        otpExp,
        password: bcryptPass,
      });
      sendOtpMail(email, otp);
      return res.render('otp', {
        err: '',
        email,
      });
    }
    const matchPass = await bcrypt.compare(password, userFound.password);
    if (!matchPass) {
      return res.render('index', { err: 'email or password is wrong' });
    }
    if (userFound.isVerfied === false) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      if (userFound.otpExp < Date.now()) {
        sendOtpMail(email, otp);
        const otpExp = new Date(new Date().getTime() + 5 * 60000);
        await user.update({ otp, otpExp }, { where: { email } });
        return res.render('otp', {
          otp,
          email,
          err: `please verify otp first sent to ${email}`,
        });
      }
      return res.render('otp', {
        otp,
        email,
        err: 'please verify otp first that we have sent ',
      });
    }
    if (!userFound.fullName) {
      return res.render('profile', {
        email,
        err: 'Please enter full Name for logging in ',
      });
    }
    const token = await jwt.sign({ id: userFound.id }, SECRET_KEY);
    const data = await getFriends(userFound);
    const msg: any = [];
    const otherUser: any = {};
    otherUser.id = 'none';
    const allotherUsers = await notFriends(userFound);
    return res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .render('dashboard', {
        data,
        msg,
        otherUser,
        allotherUsers,
        user: userFound,
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
      const blockedUser = findBockedUsers.map(
        (ids: { sender: any; receiver: any }) => {
          const a: any = [];
          if (ids.sender === id) {
            a.push(ids.receiver);
          }
          if (ids.receiver === id) {
            a.push(ids.sender);
          }
          return a;
        },
      );
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
export const verfiyOtp = async (req: any, res: any) => {
  try {
    const { email, otp }: any = req.body;
    if (!email || !otp) {
      return res.render('otp', {
        otp: '',
        email,
        err: 'email and otp are required',
      });
    }
    const foundData = await user.findOne({ where: { email } });
    if (!foundData) {
      return res.render('otp', {
        otp,
        email,
        err: 'no user found with this email',
      });
    }
    if (foundData.isVerified === true) {
      return res.render('otp', { otp, email, err: 'already verified user' });
    }
    // eslint-disable-next-line radix
    if (foundData.otp !== parseInt(otp)) {
      return res.render('otp', { otp, email, err: 'invalid otp' });
    }
    if (foundData.otpExp < Date.now()) {
      const newOtp = Math.floor(100000 + Math.random() * 900000);

      sendOtpMail(email, newOtp);
      const otpExp = new Date(new Date().getTime() + 5 * 60000);
      await user.update({ otp: newOtp, otpExp }, { where: { email } });
      return res.render('otp', {
        otp,
        email,
        err: 'otp expired enter details in login to get info',
      });
    }
    await user.update({ isVerified: true }, { where: { email } });
    return res.render('profile', { email, err: '' });
  } catch (err: any) {
    return res.render('otp', {
      err: err.message,
    });
  }
};
export const addFullName = async (req: any, res: any) => {
  const { fullName, email } = req.body;
  if (!fullName) {
    return res.render('profile', { email, err: 'Full Name is required' });
  }
  await user.update({ fullName }, { where: { email } });
  const userFound = await user.findOne({ where: { email } });
  if (!userFound) {
    return res.render('profile', { email, err: 'user not found ' });
  }
  const token = await jwt.sign({ id: userFound.id }, SECRET_KEY);
  const data = await getFriends(userFound);
  const msg: any = [];
  const otherUser: any = {};
  otherUser.id = 'none';
  const allotherUsers = await notFriends(userFound);
  return res
    .cookie('access_token', token, {
      httpOnly: true,
    })
    .render('dashboard', {
      data,
      msg,
      otherUser,
      allotherUsers,
      user: userFound,
    });
};

export const logout = async (_: any, res: any) => res.clearCookie('access_token').render('index', { err: '' });

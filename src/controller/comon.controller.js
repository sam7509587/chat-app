/* eslint-disable prefer-destructuring */
const jsonwebtoken = require('jsonwebtoken');
const { ejsData, ejsPages, HttpStatus } = require('../constants');
const { jwt: { jwtSecret, expiresIn, cookieExpire } } = require('../config');
const { asyncHandler } = require('../middleware');
const { Communication, User } = require('../models');

exports.indexPage = async (req, res, next) => res.render(ejsPages.LOGIN, ejsData);
// let token;
// if (req.headers.cookie) {
//   token = req.headers.cookie.split('=')[1];
// }
// if (!token) {
//   ejsData.err = 'you are not logged in';

// }
// const verifyToken = await jsonwebtoken.verify(token, jwtSecret);
// const userFound = await user.findOne({ where: { id: verifyToken.id } });
// res.render(ejsPages.DASHBOARD, ejsData);
// };

exports.getFriends = asyncHandler(async (user) => {
  const findFriends = await Communication.find({ $or: [{ senderId: user.id }, { receiverId: user.id }], status: 'accepted' });
  const friendIds = findFriends.map((e) => (e.senderId === user._id ? senderId : receiverid));
  const friendList = await User.find({ _id: { $in: friendIds } });
  return friendList;
});

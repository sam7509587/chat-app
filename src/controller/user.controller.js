const { HttpStatus, ejsPages, ejsData } = require('../constants');
const { asyncHandler } = require('../middleware');
const { User, Communication } = require('../models');
const {
  bcryptService, jwtService,
} = require('../services');
const { otpValiditonTemplate, sendEmail, logger } = require('../shared');
const { getFriends } = require('./comon.controller');

exports.signUpHandler = asyncHandler(async (req, res) => {
  const {
    email, password,
  } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    // sign up
    const {
      resetToken: resetPasswordToken,
      resetPasswordExpire,
    } = bcryptService.getResetPasswordToken();
    const createdUser = await User.create({
      email,
      password,
      resetPasswordToken,
      resetPasswordExpire,
    });
    const options = {
      email,
      subject: 'mail to verify otp',
      message: 'Please verify otp in 10 min',
      html: otpValiditonTemplate(resetPasswordToken),
    };
    const isMailSent = await sendEmail(options);
    if (isMailSent) {
      logger.info(
        `${HttpStatus.CREATED} - ${req.originalUrl} [${req.method}] - 'Signup successfully!' `,
      );
      ejsData.loggedUser = createdUser;
      return res.render(ejsPages.OTP, ejsData);
    }
    await createdUser.remove();
    ejsData.err = 'something went wrong try again later';
    return res.render(ejsPages.LOGIN, ejsData);
  }
  if (!(await user.matchPassword(password))) {
    ejsData.err = 'Invalid credentials';
    return res.render(ejsPages.LOGIN, ejsData);
  }
  if (user.isVerified === false) {
    if (user.resetPasswordExpire < Date.now()) {
      const options = {
        email,
        subject: 'mail to verify otp',
        message: 'Please verify otp in 10 min',
        html: otpValiditonTemplate(resetPasswordToken),
      };
      const isMailSent = await sendEmail(options);
      if (isMailSent) {
        const {
          resetToken: resetPasswordToken,
          resetPasswordExpire,
        } = bcryptService.getResetPasswordToken();
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = resetPasswordExpire;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        await user.save();
        logger.info(
          `${HttpStatus.CREATED} - ${req.originalUrl} [${req.method}] - 'Signup successfully!' `,
        );
        ejsData.loggedUser = user;
        ejsData.err = '';
        return res.render(ejsPages.OTP, ejsData);
      }
      await createdUser.remove();
      ejsData.err = 'something went wrong try again later';
      return res.render(ejsPages.LOGIN, ejsData);
    } if (user.resetPasswordExpire > Date.now()) {
      ejsData.loggedUser = user;
      ejsData.err = 'plaese verify otp first to login';
      return res.render(ejsPages.OTP, ejsData);
    }
  }
  if (!user.firstName || !user.lastName) {
    ejsData.err = 'Please enter full Name for logging in ';
    ejsData.loggedUser = user;
    return res.render(ejsPages.PROFILE, ejsData);
  }
  const token = jwtService.signToken(user._id);

  res.setHeader('token', token);
  res.cookie('token', token, jwtService.getCookieOptions(req));
  const friendList = await getFriends(user);
  if (friendList) {
    ejsData.otherUserList = await friendList;
    console.log(ejsData.otherUserList);
    return res.render(ejsPages.DASHBOARD, ejsData);
  }
  return res.render(ejsPages.DASHBOARD, ejsData);
});
exports.verfiyOtpHandler = asyncHandler(async (req, res) => {
  const { email, resetPasswordToken } = req.body;
  const foundData = await User.findOne({ email });
  if (!foundData) {
    ejsData.err = 'no user found with this email';
    return res.render(ejsPages.OTP, ejsData);
  }
  ejsData.loggedUser = foundData;
  if (foundData.isVerified === true) {
    ejsData.err = 'already verified user';
    return res.render(ejsPages.OTP, ejsData);
  }
  if (foundData.resetPasswordExpire < Date.now()) {
    ejsData.err = 'otp expired enter details in login to get info';
    res.render(ejsPages.OTP);
  }
  if (foundData.resetPasswordToken !== resetPasswordToken) {
    ejsData.err = 'Invalid Token';
    res.render(ejsPages.OTP);
  }
  foundData.isVerified = true;
  foundData.resetPasswordToken = undefined;
  foundData.resetPasswordExpire = undefined;
  await foundData.save();
  return res.render(ejsPages.PROFILE, ejsData);
});
exports.profileHandler = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  if (!firstName || !lastName) {
    ejsData.loggedUser.email = email;
    return res.render(ejsPages.PROFILE, ejsData);
  }
  const userFound = await User.findOne({ email });
  if (!userFound) {
    ejsData.loggedUser = userFound;
    ejsData.err = 'user not found ';
    return res.render(ejsPages.PROFILE, ejsData);
  }
  userFound.firstName = firstName;
  userFound.lastName = lastName;
  await userFound.save();
  return res.render(ejsPages.DASHBOARD);
});
exports.getUsers = asyncHandler(async (req, res) => {
  const { user } = req;
  const { search } = req.query;
  const re = new RegExp(search, 'i');
  const searchObj = { $or: [{ firstName: re }, { lastName: re }, { email: re }] };
  const findFriends = await Communication.find({
    $or: [{ senderId: user.id }, { receiverId: user.id }],
  });
  let friendIds = [];
  if (findFriends.length !== 0) {
    friendIds = findFriends.map((e) => (e.senderId === user.id ? e.receiverId : e.senderId));
  }
  friendIds.push(user.id);
  console.log(friendIds);
  const data = await User.find({ $and: [searchObj, { _id: { $nin: friendIds } }] });
  res.status(HttpStatus.FOUND).json({
    statusCode: HttpStatus.Found,
    data,
  });
});
exports.logoutHandler = asyncHandler(async (_, res) => {
  res.cookie('token', 'loggedOut', {
    maxAge: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return res
    .status(HttpStatus.OK)
    .json({ statusCode: HttpStatus.OK, message: 'Logout Successfully!' });
});

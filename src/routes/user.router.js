const userRouter = require('express').Router();

const {
  Routes: { AUTH },
} = require('../constants');

const {
  userController: {
    signUpHandler, verfiyOtpHandler, profileHandler, getUsers,
  },
} = require('../controller');
const { verifyToken } = require('../middleware');
const { user } = require('../validitions');

userRouter.post(AUTH.SIGNUP, user.validateLogin, signUpHandler);
userRouter.post(AUTH.VERIFY_OTP, verfiyOtpHandler);
userRouter.post(AUTH.ADD_NAME, profileHandler);
userRouter.get(AUTH.GET_USERS, verifyToken, getUsers);
module.exports = { userRouter };

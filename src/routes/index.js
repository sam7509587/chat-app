const restRouter = require('express').Router();
const {
  Routes: { AUTH, COMMON, COMMUNICATION },
} = require('../constants');
const googleRouter = require('./google.router');
const { userRouter } = require('./user.router');
const commonRouter = require('./common.router');
const communiation = require('./communication.router');

restRouter.use(COMMON, commonRouter);
restRouter.use(COMMON, googleRouter);
restRouter.use(AUTH.DEFAULT, userRouter);
restRouter.use(COMMUNICATION.DEFAULT, communiation);

module.exports = { restRouter };

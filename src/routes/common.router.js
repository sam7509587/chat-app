const commonRouter = require('express').Router();

const {
  Routes: { COMMON },
} = require('../constants');

const {
  commonController: {
    indexPage,
  },
} = require('../controller');

commonRouter.get(COMMON, indexPage);
module.exports = commonRouter;

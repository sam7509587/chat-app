const communiation = require('express').Router();
const { Routes: { COMMUNICATION: { SEND_REQUEST, DETAIL } } } = require('../constants');
const { communicationController: { sendRequest } } = require('../controller');
const { verifyToken } = require('../middleware');

communiation.get(SEND_REQUEST + DETAIL, verifyToken, sendRequest);
module.exports = communiation;

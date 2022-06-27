const { ErrorMessage } = require('./error-message.constants');
const { Routes } = require('./route.constants');
const { HttpStatus } = require('./http-status.constants');
const { ejsData, ejsPages } = require('./ejs.constants');

module.exports = {
  HttpStatus,
  ErrorMessage,
  Routes,
  UserRoles: {
    ADMIN: 'admin', USER: 'user',
  },
  ejsData,
  ejsPages,
};

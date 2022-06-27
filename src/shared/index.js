const sendEmail = require('./sendMail');

module.exports = {
  ...require('./logger'),
  ...require('./utils'),
  ...require('./gerateOtp'),
  ...require('./mailTemplates'),
  sendEmail,
};

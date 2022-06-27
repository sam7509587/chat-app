const { genSalt, compare, hash } = require('bcryptjs');
const { createHash } = require('crypto');

const config = require('../config');
const { generateOtp } = require('../shared');

const hashPassword = async (password) => {
  const salt = await genSalt(config.hash);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (enteredPassword, originalPassword) => {
  const isMatch = await compare(enteredPassword, originalPassword);
  return isMatch;
};

const getResetPasswordToken = (minutes = 10) => {
  // Generate token
  const resetToken = generateOtp(4, {
    digits: true,
    lowerCaseAlphabets: false,
    onlyNumbers: true,
    specialChars: false,
    upperCaseAlphabets: false,
  });

  // Set expire 10 mins
  const resetPasswordExpire = new Date(Date.now() + minutes * 60 * 1000);
  return {
    resetToken,
    resetPasswordExpire,
  };
};

const updateResetToken = (resetToken) => {
  const resetPasswordToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');
  return resetPasswordToken;
};

module.exports = {
  hashPassword,
  comparePassword,
  updateResetToken,
  getResetPasswordToken,
};

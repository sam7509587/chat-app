const asyncHandler = require('./async-handler');
const { User } = require('../models');
const { jwtService } = require('../services');
const { ErrorMessage, ejsPages } = require('../constants');
const { UnauthorizedException } = require('../errors');

// @desc   Verify Token Middleware
const verifyToken = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }
  if (req.headers.cookie.split('=')[1]) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.cookie.split('=')[1];
  }
  if (!token) {
    return res.render(ejsPages.LOGIN, { err: 'token not found' });
  }

  // 2) Verification token
  const decoded = await jwtService.verifyToken(token);
  if (!decoded || !decoded.id) {
    return res.render(ejsPages.LOGIN, { err: 'token not found' });
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded?.id);
  if (!currentUser) {
    return res.render(ejsPages.LOGIN, { err: 'token not found' });
  }

  // Check if user changed password after the token was issued
  if (currentUser?.changedPasswordAfter(decoded?.iat)) {
    return res.render(ejsPages.LOGIN, { err: 'you cahnged password recently please login agai' });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  return next();
});

module.exports = {
  verifyToken,
};

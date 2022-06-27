const { ejsPages, HttpStatus } = require('../constants');
const { asyncHandler } = require('../middleware');
const { Communication, User } = require('../models');

exports.sendRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const ids = [id, userId];
  const userFound = await User.findOne({ id });
  if (!userFound) {
    return res.render(ejsPages.DASHBOARD, { err: 'no user found' });
  }
  const requestFound = await Communication.findOne({
    $or: [
      { senderId: { $in: ids } }, { receiverId: { $in: ids } }],
  });
  if (!requestFound) {
    await Communication.create({ senderId: userId, receiverId: id });
    return res.json({
      statusCode: HttpStatus.OK,
      message: 'request sent',
    });
  }
  const da = await requestFound.remove();
  return res.json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'already sent request',
  });
});

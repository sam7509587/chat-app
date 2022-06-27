const ApiError = require('./api.error');

const errorHandler = (
  err,
  _,
  res,
  __,
) => {
  if (err instanceof ApiError) {
    return res.status(err.code).json({
      statusCode: err.code,
      message: err.msg,
    });
  }
  console.log(err);
  return res.status(500).json({ statusCode: 500, message: err.msg });
};
module.exports = errorHandler;

/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import ApiError from './apiError';

const errorHandler = (
  err: { code: number; msg: string },
  _: any,
  res: any,
  __: any,
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
export default errorHandler;

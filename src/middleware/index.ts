/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ApiError, SECRET_KEY } from '../config';

const { user } = require('../db/models');

const validateBody = (
  schema: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = schema.validate(req.body);
  if (result.error) {
    const errorMsg = result.error.details[0].message.replace(
      /[^a-zA-Z0-9 ]/g,
      '',
    );
    return res.render('index', { err: errorMsg });
  }
  next();

  return true;
};
export default validateBody;
export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.cookie.split('=')[1];
    if (!token) {
      return res.status(409).json({
        statusCode: 409,
        message: 'token is required',
      });
    }
    return await jwt.verify(
      token,
      SECRET_KEY,
      async (err: any, result: any) => {
        if (err) {
          return next(new ApiError(409, err.message));
        }
        const { id } = result;
        const userFound = await user.findOne({ where: { id } });
        req.user = userFound;
        return next();
      },
    );
  } catch (err: any) {
    console.log(err);
    return next(new ApiError(400, err.message));
  }
};

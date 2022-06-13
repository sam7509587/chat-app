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
    let token;
    if (req.headers?.cookie) {
      token = req.headers?.cookie.split('=')[1];
    }
    if (!token) {
      return res.render('index', { err: 'you are not logged in' });
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
    return res.render('index', { err: err.message });
  }
};

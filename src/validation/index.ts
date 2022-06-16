/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import * as joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { v4 as UUIDValidate } from 'uuid';
import validateBody from '../middleware';
import { ApiError } from '../config';

export const userValidition = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = joi.object({
    fullName: joi.string().min(0).trim(),
    email: joi.string().email().trim().required(),
    password: joi.string().min(6).max(15).trim()
      .required(),
  });
  validateBody(schema, req, res, next);
};

export const validateId = (req:any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validId = UUIDValidate(id);
    if (!validId) {
      return res.status(409).json({
        statusCode: 409,
        message: 'enter valid id',
      });
    }
    req.params.id = id;
    return next();
  } catch (err: any) {
    return next(new ApiError(400, err.message));
  }
};

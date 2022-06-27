const Joi = require('joi');
const { HttpStatus } = require('../constants');

const { JoiException } = require('../errors');

exports.validateSignup = async (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().min(0).max(15).required(),
    lastName: Joi.string().min(0).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30),
  });
  JoiException(schema, req, res, next);
};

exports.validateLogin = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(30),
  });

  JoiException(schema, req, res, next);
};

exports.validateForgotPassword = async (req, _, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });

  JoiException(schema, req, res, next);
};

exports.validateResetPassword = async (req, _, next) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(6).max(30),
  });

  JoiException(schema, req, res, next);
};
exports.validateOtp = async (req, _, next) => {
  const schema = Joi.object().keys({
    resetPasswordToken: Joi.string().min(4).max(4).required(),
    email: Joi.string().email().required(),
  });
  JoiException(schema, req, res, next);
};

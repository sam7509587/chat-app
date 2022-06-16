/* eslint-disable import/no-unresolved */
import * as dotEnv from 'dotenv';
import ApiError from './apiError';
import errorHandler from './errorHandler';

dotEnv.config();
export { errorHandler };
export { ApiError };
export const { PORT } = process.env;
export const { USER_MAIL } = process.env;
export const { USER_PASSWORD } = process.env;
export const { CLIENT_SECRET } = process.env;
export const { CLIENT_ID } = process.env;
export const { SECRET_KEY }: any = process.env;
export const { BASE_URL } = process.env;

const dotenv = require('dotenv');
const {
  NodeEnv,
  getOsEnv,
  toNumber,
} = require('../shared/utils');

dotenv.config({ path: `.env.${getOsEnv('NODE_ENV')}` });
module.exports = {
  env: getOsEnv('NODE_ENV'),
  port: getOsEnv('PORT'),
  isProduction: getOsEnv('NODE_ENV') === NodeEnv.PRODUCTION,
  isDevelopment: getOsEnv('NODE_ENV') === NodeEnv.isDevelopment,
  db: {
    mongoUri: getOsEnv('MONGO_URL'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  jwt: {
    expiresIn: getOsEnv('EXPIRES_IN'),
    jwtSecret: getOsEnv('JWT_SECRET'),
    cookieExpire: toNumber(getOsEnv('COOKIE_EXPIRE')),
  },
  hash: toNumber(getOsEnv('HASH_SALT')),
  clientUrl: getOsEnv('CLIENT_URL'),
  baseUrl: '/api/v2',
  corsUrl: '*',
  mail: {
    service: getOsEnv('SMTP_SERVICE'),
    host: getOsEnv('SMTP_HOST'),
    port: toNumber(getOsEnv('SMTP_PORT')),
    email: getOsEnv('SMTP_EMAIL'),
    password: getOsEnv('SMTP_PASSWORD'),
    fromName: getOsEnv('FROM_NAME'),
    fromEmail: getOsEnv('FROM_EMAIL'),
    secure: false,
  },
};

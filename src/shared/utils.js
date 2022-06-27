const NodeEnv = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};
const isNull = (val) => val === null;

const isUndefined = (val) => typeof val === 'undefined';

const isNil = (val) => val === '';

const isEmpty = (val) => isUndefined(val) || isNull(val) || isNil(val);

const isBoolean = (val) => typeof val === 'boolean';

const toNumber = (val) => Number.parseInt(val, 10);

const getOsEnv = (key) => {
  const { env } = process;
  if (isEmpty(env[key])) {
    console.log(`[ENV] ${key} is not set.`);
  }
  return env[key];
};

const normalizePort = (port) => {
  const parsedPort = toNumber(port);
  if (Number.isNaN(parsedPort)) {
    return port;
  }
  if (parsedPort >= 0) {
    return parsedPort;
  }
  return false;
};

module.exports = {
  NodeEnv,
  getOsEnv,
  isEmpty,
  isNil,
  isNull,
  isBoolean,
  isUndefined,
  toNumber,
  normalizePort,
};

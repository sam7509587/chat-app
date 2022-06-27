module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    'global-require': 'off',
    'no-undef': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
  },
};

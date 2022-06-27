const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const { baseUrl, corsUrl } = require('./config');
const { restRouter } = require('./routes');
const { errorHandler } = require('./errors');
const { ejsPages } = require('./constants');

const app = express();
app.use(cors({ origin: corsUrl }));
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'ErrorMessage.TO_MANY_REQUEST',
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
require('./config/passport');

app.use(express.static(path.join(__dirname, './views')));
app.set('views', path.join(__dirname, './views/ejs'));
app.use(`${baseUrl}`, restRouter);
app.all('*', (req, res, __) => {
  console.log(`Can't find ${req?.originalUrl} on this server!`);
  res.render(ejsPages.PAGE404);
});
app.use(errorHandler);
module.exports = { app };

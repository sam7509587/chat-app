/* eslint-disable import/no-unresolved */
import express from 'express';
import path from 'path';
import { errorHandler } from './config';
import routes from './routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './views')));
app.set('views', path.join(__dirname, './views/pages'));

app.use('/', routes);
app.use(errorHandler);

export default app;

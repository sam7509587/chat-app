/* eslint-disable import/no-unresolved */
import { Server } from 'socket.io';
import http from 'http';
import app from './src/app';
import { PORT } from './src/config';
import db from './src/db/models';

const server = http.createServer(app);
const io = new Server(server);
app.set('io', io);
db.sequelize
  .authenticate({ logging: false })
  .catch(() => {
    console.log('database not connected ');
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`connected to http://127.0.0.1:${PORT}`);
      console.log('db connected');
    });
  });

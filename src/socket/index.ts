/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import { formatDate } from '../services';

const { message } = require('../db/models');

export = (io: {
  on: (arg0: string, arg1: (socket: any) => void) => void;
  emit: (arg0: string, arg1: any) => void;
}) => {
  io.on(
    'connection',
    (socket: {
      on: (arg0: string, arg1: (data: any) => Promise<void>) => void;
    }) => {
      socket.on('undateMsgRead', async (data: { id: any }) => {
        const updatedMsg = await message.update(
          { isRead: true },
          { where: { id: data.id } },
        );
        updatedMsg.msgSentOn = formatDate(updatedMsg.createdAt);
        io.emit('msg-read', updatedMsg);
      });
    },
  );
};

/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-shadow */

import * as Sequelize from 'sequelize';

const { conversation, user, message } = require('../db/models');

const { Op } = Sequelize;
export const formatDate = (date: any) => {
  let setDate = '';
  const hour = date.getHours();
  let minute = date.getMinutes();
  if (hour > 12) {
    if (minute < 10) {
      minute = `0${minute}`;
    }
    setDate += `${hour - 12}:${minute} pm`;
  } else {
    if (minute < 10) {
      minute = `0${minute}`;
    }
    setDate += `${hour}:${minute} am`;
  }
  return setDate;
};
export const getFriends = async (userData: { id: any }) => {
  const { id } = userData;

  const friends = await conversation.findAll({
    where: { [Op.or]: [{ sender: id }, { receiver: id }], status: 'accepted' },
  });
  const friendsId: any = [];
  friends.map((items: { sender: any; receiver: any }) => {
    if (items.sender === id) {
      friendsId.push(items.receiver);
    } else {
      friendsId.push(items.sender);
    }
  });
  const data = await user.findAll({
    where: {
      id: { [Op.in]: friendsId },
    },
    attributes: ['fullName', 'id', 'email'],
  });
  /// ///last message

  for (let i = 0; i < data.length; i + 1) {
    const ids = [id, data[i].id];
    await message
      .findAll({
        limit: 1,
        where: {
          to: { [Op.or]: ids },
          from: { [Op.or]: ids },
        },
        order: [['createdAt', 'DESC']],
      })
      .then((result: any) => {
        if (result[0]?.dataValues) {
          data[i].dataValues.message = result[0]?.dataValues;
          data[i].dataValues.message.msgSentOn = formatDate(
            result[0].dataValues.createdAt,
          );
        }
      });
    await message
      .count({ where: { to: id, from: data[i].id, isRead: false } })
      .then((result: any) => {
        data[i].dataValues.unReadCount = result;
      });
  }
  return data;
};
/// /
export const MsgById = async (userData: { id: any }, otherId: any) => {
  const { id } = userData;
  const ids: any = [id, otherId];
  await message.update(
    { isRead: true },
    { where: { from: otherId, to: id, isRead: false } },
  );

  const data = await message.findAll({
    where: {
      to: { [Op.or]: ids },
      from: { [Op.or]: ids },
    },
    order: [['createdAt', 'ASC']],
    attributes: ['to', 'from', 'createdAt', 'message', 'isRead', 'id'],
    include: [
      {
        model: user,
        as: 'sender',
        attributes: ['fullName', 'id'],
      },
      {
        model: user,
        as: 'receiver',
        attributes: ['fullName', 'id'],
      },
    ],
  });

  data
    .filter(
      (element: { isRead: boolean; to: any; from: any }) => element.isRead === false
        && element.to === id
        && element.from === otherId,
    )
    .map((ids: { id: any }) => ids.id);
  const otherUser = await user.findOne({ where: { id: otherId } });
  const MsgWithTime = data.map((element: any) => {
    element.msgSentOn = formatDate(element.createdAt);
    return element;
  });
  return { msg: MsgWithTime, otherUser };
};

export const notFriends = async (userData: { id: any }) => {
  const { id } = userData;

  const friends = await conversation.findAll({
    where: { [Op.or]: [{ sender: id }, { receiver: id }] },
  });
  const friendsId: any = [id];
  friends.map((items: { sender: any; receiver: any }) => {
    if (items.sender === id) {
      friendsId.push(items.receiver);
    } else {
      friendsId.push(items.sender);
    }
    return true;
  });
  const data = await user.findAll({
    where: {
      id: { [Op.notIn]: friendsId },
    },
    attributes: ['fullName', 'id', 'email'],
  });
  return data;
};

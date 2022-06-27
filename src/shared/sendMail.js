const nodemailer = require('nodemailer');

const { logger } = require('./logger');
const { mail } = require('../config');

const sendEmail = async (options) => {
  const {
    host,
    port,
    secure,
    service,
    email: user,
    password: pass,
    fromName,
    fromEmail,
  } = mail;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    service,
    auth: { user, pass },
  });

  const { email: to, subject, message: text, html } = options;
  const message = {
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  };
  try {
    const info = await transporter.sendMail(message);
    logger.info(`Email sent: ${info?.messageId}`);
    return true;
  } catch (error) {
    logger.error(
      `[Mail Error] [${error?.code}] [${error?.responseCode}] ${error?.response}`,
    );
    return null;
  }
};

module.exports = sendEmail;

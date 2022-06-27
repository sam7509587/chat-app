const ejsData = {
  loggedUser: {},
  otherUserList: [],
  selectedUser: { id: 'none' },
  messages: [],
  err: '',
};
const ejsPages = {
  PAGE404: 'page404',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  OTP: 'otp',
  PROFILE: 'profile',
};
module.exports = { ejsData, ejsPages };

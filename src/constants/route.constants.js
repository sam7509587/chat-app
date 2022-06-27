const Routes = {
  COMMON: '/',
  GOOGLE: 'google',
  AUTH: {
    DEFAULT: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    SIGNUP: '/signup',
    VERIFY_OTP: '/verifyOtp',
    ADD_NAME: '/profile',
    ME: '/me',
    FORGOT_PASSWORD: '/forgotPassword',
    RESET_PASSWORD: '/resetPassword/:resetToken',
    UPDATE_PASSWORD: '/changePassword',
    RESEND_OTP: '/resendOtp',
    GET_USERS: '/getUsers',
  },
  USER: {
    DEFAULT: '/users',
    addBrakingCalculation: '/braking',
    showVelocity: '/velocity',
    ALL: '/',
    DETAIL: '/:id',
  },
  COMMUNICATION: {
    DEFAULT: '/communication',
    SEND_REQUEST: '/sendRequest',
    ACCEPT_REJECT_REQUEST: '/acceptRequest',
    SEE_REQUEST: '/seeRequest',
    DETAIL: '/:id',
  },
  HEALTH: '/health',
};

module.exports = { Routes };

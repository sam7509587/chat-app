const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.Url,
    passReqToCallback: true,
  },
  ((request:any, accessToken:any, refreshToken:any, profile:any, done:any) => done(null, profile)
  // console.log(profile, request, accessToken, refreshToken);

  ),
));

passport.serializeUser((user:any, done:any) => {
  /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
  done(null, user);
});

passport.deserializeUser((user:any, done:any) => {
  /*
    Instead of user this function usually recives the id
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
  done(null, user);
});

var passport = require('passport');
var strategy = require('passport-bnet').Strategy;

passport.use(new strategy({
  clientID: 'a6mjhkeukctpnarj9acn4ab65ff736y6',
  clientSecret: 'Kn2cnRQyJRwXrhyZAHSZ72DHMyDBfcet',
  callbackURL: 'https://overmatch.co.kr/battlenet_callback'
}, function(access_token, refresh_token, profile, done) {
  return done(null, profile);
}));

module.exports = passport;

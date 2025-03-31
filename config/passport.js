const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const isProduction = process.env.NODE_ENV === "production"
const domain = isProduction ? "https://nesskenya-cse-341-credit-card-team-final.onrender.com/":"http://localhost:8080";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${domain}/auth/google/callback/`
}, function (accessToken, refreshToken, profile, done)  {

  // You would typically look for this user in MongoDB and create if not found
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

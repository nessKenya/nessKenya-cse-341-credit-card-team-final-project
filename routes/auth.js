const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect user to Google for authentication
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback route after Google authenticates
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.send('Google Authentication Successful');
  });

module.exports = router;

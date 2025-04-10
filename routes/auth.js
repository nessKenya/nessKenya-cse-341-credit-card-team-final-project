const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/', (req, res) => {
  return res.send(req.session?.user ? `Logged In! <br><br>Welcome, ${req.session.user.displayName}`: 'Logged Out')
})

router.get('/login', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback/', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect('/');
  });

router.get('/logout', function(req, res, next) {
  req.logout(function(err){
    if(err) {return next(err)}
    res.redirect('/')
  })
})

module.exports = router;
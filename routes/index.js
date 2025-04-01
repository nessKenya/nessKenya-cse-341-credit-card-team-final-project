<<<<<<< HEAD
const router = require("express").Router();
const passport = require('passport');


router.use("/users", require("./usersRoute"))
router.use("/cards", require("./creditcardRoute"))

router.get('/login', passport.authenticate('github'));


router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err)}
    res.redirect('/')
  })
})
module.exports = router;
=======
// app.js or index.js
const express = require('express');
const app = express();
app.use(express.json());

app.use('/users', require('./usersRoute'));
app.use('/cards', require('./creditcardRoute'));
app.use('/transactions', require('./transactionRoute'));
app.use('/disputes', require('./disputeRoute'));

// (export or start the server)
>>>>>>> 4f96c32fb8628f8cdb334dfc1f7572544ac54510

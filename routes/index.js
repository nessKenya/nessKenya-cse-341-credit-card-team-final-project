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
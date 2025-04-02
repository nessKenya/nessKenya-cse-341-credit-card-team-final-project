const express = require("express")
const router = new express.Router()
const usersController = require('../controllers/usersController')
const validation = require('../middleware/validation')
const { isAuthenticated } = require("../middleware/authenticate")


router.get('/', usersController.getAll);

router.get('/:id', usersController.getOne);

router.post('/', isAuthenticated, validation.saveuser, usersController.createUser);

router.put('/:id', isAuthenticated, validation.saveuser, usersController.updateUser);

router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;
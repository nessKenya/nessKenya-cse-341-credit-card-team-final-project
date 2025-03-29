const express = require("express")
const router = new express.Router()
const usersController = require('../controllers/usersController')
const validation = require('../middleware/validation')


router.get('/', usersController.getAll);

router.get('/:id', usersController.getOne);

router.post('/', validation.saveuser, usersController.createUser);

router.put('/:id', validation.saveuser, usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;
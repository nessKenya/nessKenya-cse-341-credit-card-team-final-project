const express = require("express")
const router = new express.Router()
const creditCardController = require('../controllers/creditCardController')
const validation = require('../middleware/validation')
const { isAuthenticated } = require("../middleware/authenticate")

router.get('/', creditCardController.getAll);

router.get('/:id', creditCardController.getOne);

router.post('/', isAuthenticated, validation.savecreditcard, creditCardController.createCreditCard);

router.put('/:id', isAuthenticated, validation.savecreditcard, creditCardController.updateCreditCard);

router.delete('/:id',isAuthenticated,  creditCardController.deleteCreditCard);

module.exports = router;
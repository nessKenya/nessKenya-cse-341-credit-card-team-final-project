const express = require("express")
const router = new express.Router()
const creditCardController = require('../controllers/creditCardController')
const validation = require('../middleware/validation')


router.get('/', creditCardController.getAll);

router.get('/:id', creditCardController.getOne);

router.post('/', validation.savecreditcard, creditCardController.createCreditCard);

router.put('/:id', validation.savecreditcard, creditCardController.updateCreditCard);

router.delete('/:id', creditCardController.deleteCreditCard);

module.exports = router;
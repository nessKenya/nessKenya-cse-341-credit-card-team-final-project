const express = require("express")
const router = new express.Router()
const transactionController = require('../controllers/transactionController')
const validation = require('../middleware/validation')


router.get('/', transactionController.getAll);

router.get('/:id', transactionController.getOne);

router.post('/', validation.validateTransaction, transactionController.createTransaction);

router.put('/:id', validation.validateTransaction, transactionController.updateTransaction);

router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
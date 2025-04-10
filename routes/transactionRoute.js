const express = require("express")
const router = new express.Router()
const transactionController = require('../controllers/transactionController')
const validation = require('../middleware/validation')
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', transactionController.getAll);

router.get('/:id', transactionController.getOne);

router.post('/', isAuthenticated, validation.validateTransaction, transactionController.createTransaction);

router.put('/:id', isAuthenticated, validation.validateTransaction, transactionController.updateTransaction);

router.delete('/:id', isAuthenticated, transactionController.deleteTransaction);

module.exports = router;
const express = require("express")
const router = new express.Router()
const disputeController = require('../controllers/disputeController')
const validation = require('../middleware/validation')
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/',  disputeController.getAll);

router.get('/:id', disputeController.getOne);

router.post('/', isAuthenticated, validation.validateDispute, disputeController.createDispute);

router.put('/:id', isAuthenticated, validation.validateDispute, disputeController.updateDispute);

router.delete('/:id', isAuthenticated, disputeController.deleteDispute);

module.exports = router;
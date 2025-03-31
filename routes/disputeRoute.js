const express = require("express")
const router = new express.Router()
const disputeController = require('../controllers/disputeController')
const validation = require('../middleware/validation')


router.get('/', disputeController.getAll);

router.get('/:id', disputeController.getOne);

router.post('/', validation.validateDispute, disputeController.createDispute);

router.put('/:id', validation.validateDispute, disputeController.updateDispute);

router.delete('/:id', disputeController.deleteDispute);

module.exports = router;
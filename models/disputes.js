const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['fraud', 'duplicate', 'unauthorized', 'incorrect_amount', 'product_not_received', 'other'],
    required: true
  },
  description: String,
  evidence: [String],
  status: {
    type: String,
    enum: ['open', 'under_review', 'resolved', 'rejected'],
    default: 'open'
  },
  resolution: {
    type: String,
    default: null
  },
  openedAt: {
    type: Date,
    default: Date.now
  },
  closedAt: Date
});

module.exports = mongoose.model('Dispute', disputeSchema);

const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Card'
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Transaction'
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'resolved', 'closed'],
    default: 'open'
  },
  openedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Dispute', DisputeSchema);

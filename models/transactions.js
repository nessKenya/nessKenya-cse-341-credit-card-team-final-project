const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  merchant: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  timestamp: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

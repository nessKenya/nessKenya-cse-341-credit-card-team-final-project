const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  cardHolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User schema
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  merchant: {
    name: String,
    category: String,
    location: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'disputed', 'refunded'],
    default: 'pending'
  },
  transactionType: {
    type: String,
    enum: ['purchase', 'refund', 'cash_advance'],
    default: 'purchase'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);

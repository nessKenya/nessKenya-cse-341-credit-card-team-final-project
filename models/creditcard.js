// models/CreditCard.js
const mongoose = require('mongoose');

const CreditCardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cardType: String,
  cardBrand: String,
  cardNumberMasked: String,
  last4: String,
  expiration: {
    month: Number,
    year: Number
  },
  isPrimary: Boolean
}, { timestamps: true });

module.exports = mongoose.model('CreditCard', CreditCardSchema);

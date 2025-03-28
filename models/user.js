// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

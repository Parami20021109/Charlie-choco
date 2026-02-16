const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'user', 'admin', 'supplier', 'chef', 'delivery'
  points: { type: Number, default: 0 },
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' }
});

module.exports = mongoose.model('User', UserSchema);

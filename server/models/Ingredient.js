const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'kg' }, // kg, liters, pcs
  minLevel: { type: Number, default: 10 }, // Alert threshold
});

module.exports = mongoose.model('Ingredient', IngredientSchema);

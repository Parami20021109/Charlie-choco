const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  ingredients: [{
    ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
    quantity: { type: Number, required: true } // Quantity needed per batch
  }],
  // Optional: Link to a store product to auto-update stock when cooked
  productLink: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } 
});

module.exports = mongoose.model('Recipe', RecipeSchema);

const mongoose = require('mongoose');

const CustomBarSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    base: { type: String, required: true }, // Milk, Dark, White, Ruby
    toppings: [{ type: String }],
    filling: { type: String },
    wrapperColor: { type: String, default: '#D4AF37' }, // Golden by default
    labelName: { type: String },
    price: { type: Number, default: 15.00 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomBar', CustomBarSchema);

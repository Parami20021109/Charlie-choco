const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    poNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [{
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true }, // Captured at time of order
        total: { type: Number }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Ordered', 'Received', 'Cancelled'], 
        default: 'Pending' 
    },
    orderDate: { type: Date, default: Date.now },
    expectedDelivery: { type: Date },
    receivedDate: { type: Date },
    notes: { type: String }
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

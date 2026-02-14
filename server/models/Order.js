const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest checkout
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Paid, Shipped
  deliveryStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trackingId: { type: String },
  deliveryStatus: { type: String, default: 'Pending' }, // Pending, Assigned, Out for Delivery, Delivered
  deliveryUpdates: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String
    }
  ],
  createdAt: { type: Date, default: Date.now },
  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Order', OrderSchema);

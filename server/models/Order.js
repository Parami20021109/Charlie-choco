const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest checkout
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.Mixed }, // Can be ObjectId or String
      name: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      isCustom: { type: Boolean, default: false }
    }
  ],
  totalAmount: { type: Number, required: true },
  pointsEarned: { type: Number, default: 0 },
  pointsRedeemed: { type: Number, default: 0 },
  goldenTicket: { type: Boolean, default: false },
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

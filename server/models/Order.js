import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemNumber: { type: String, required: true },
  itemName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  estimatedDeliveryDay: { type: Date, required: true },
  orderStatus: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
});

export default mongoose.model('Order', OrderSchema);

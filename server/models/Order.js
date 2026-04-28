const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  email: String,
  items: [
  {
    productId: String,
    quantity: Number,
    snapName: String,
    snapPrice: Number,
    snapImage: String,
    category: Stringy
  }
],
  totalPrice: Number,

  paymentMethod: {
  type: String
},
paymentStatus: {
  type: String,
  default: "Pending"
},
razorpay_order_id: String,
razorpay_payment_id: String,
  status: String,
  datetime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
  },

  address: {   
    name: String,
    phone: String,
    flat: String,
    street: String,
    pincode: String,
    city: String,
    district: String,
    state: String,
    landmark: String
  },
});
module.exports = { OrderSchema };

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
  address: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    flat: { type: String, default: "" },
    street: { type: String, default: "" },
    pincode: { type: String, default: "" },
    city: { type: String, default: "" },
    district: { type: String, default: "" },
    state: { type: String, default: "" },
    landmark: { type: String, default: "" }
  }
}, { minimize: false }); 

module.exports = UserSchema;

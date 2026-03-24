const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
 email: {
    type: String,
    required: true,
    unique:true
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  }
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
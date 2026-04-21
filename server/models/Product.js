const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
 id:String,
 name:String,
 brand:String,
 category:String,
 subCategory:String,
 section:String,
 star:String,
 newPrice:String,
 oldPrice:String,
 discount:String,
 saveAmount:String,
 size:String,
 image:String,
createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date }
});
module.exports = mongoose.model("products", ProductSchema);

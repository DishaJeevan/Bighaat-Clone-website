const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const UserSchema = require("./models/User").schema;
const sendMail = require("./mailsend");
const otpGenerator = require("otp-generator");
const ProductSchema = require("./models/Product").schema;
const { OrderSchema } = require("./models/Order");


/*const fs=require("fs");*/
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://bighaat-clone-website.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));


/*
const multer=require("multer");
const path=require("path");
const storage=multer.diskStorage({
destination:function(req,file,cb){
cb(null,"uploads/");
},
filename:function(req,file,cb){
cb(null,Date.now()+path.extname(file.originalname));
}
});
const upload=multer({storage:storage});
app.use("/uploads",express.static("uploads"));*/

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const parser = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
       folder: "products",
      format: async (req, file) => {
        
        const ext = file.mimetype.split("/")[1].toLowerCase();
        
        const allowedFormats = ["jpeg", "jpg", "png", "webp"];
        return allowedFormats.includes(ext) ? ext : "png"; 
      },
      public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`
    }
  })
});

const userDB = mongoose.createConnection(process.env.USER_DB_URI);
const adminDB = mongoose.createConnection(process.env.ADMIN_DB_URI);

userDB.once("open", () => console.log("Login DB Connected"));
adminDB.once("open", () => console.log("Admin DB Connected"));



const UserModel = userDB.model("users", UserSchema);
const ProductModel = adminDB.model("products", ProductSchema);
const OrderModel = adminDB.model("orders", OrderSchema);
 
function generateOTP() {
  return otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
}

function createOTP() {
  const otp = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000;
  return { otp, expiry };
}

app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }
    let user = await UserModel.findOne({ email });
    const now = new Date();

    if (user && user.otp && user.otpExpires > now) {
      await sendMail(
        email,
        "Your OTP for Login",
        `<h3>${user.otp} is your login OTP. It is valid for the next 5 minutes. Do not share your OTP with anyone.</h3>`
      );
      return res.json({ message: "OTP resent successfully" });
    }
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    if (!user) {
      user = await UserModel.create({ email, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }
    await sendMail(
      email,
      "Your OTP for Login",
      `<h5>${otp} is your login OTP. It is valid for the next 5 minutes. Do not share your OTP with anyone.</h5>`
    );
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    res.json({
      message: "OTP verified successfully",
      email: user.email,
      user_id: user._id  
    });

  } catch (err) {
    console.log("Verification error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Resend OTP route called for:", email);
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const now = new Date();

    if (user.otp && user.otpExpires > now) {
      await sendMail(
        email,
        "Resend- OTP for Login",
        `<h3>${user.otp} is your login OTP. It is valid for 5 minutes.</h3>`
      );
      return res.json({ message: "Same OTP resent successfully" });
    }

    const newOtp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = newOtp;
    user.otpExpires = otpExpires;
    await user.save();
    await sendMail(
      email,
      "Your OTP for Login-Resend otp",
      `<h3>${newOtp} is your new login OTP. It is valid for 5 minutes.</h3>`
    );
    res.json({ message: "New OTP generated and sent" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/add-product", parser.single("image"), async (req,res)=>{
   console.log("Received file:", req.file); // 🔹 Check this in console
  console.log("Request body:", req.body);
  try {
    const product = new ProductModel({
      id: req.body.id,
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      subCategory: req.body.subCategory,
      section: req.body.section,
      star: req.body.star,
      newPrice: req.body.newPrice,
      oldPrice: req.body.oldPrice,
      discount: req.body.discount,
      saveAmount: req.body.saveAmount,
      size: req.body.size,
      image: req.file ? req.file.path : "",
    });

    await product.save();
    res.json({message:"Product added successfully", product});
  } catch(err) {
    console.error(err);
    res.status(500).json({error:"Server Error"});
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/delete-product/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product && product.image) {
      const parts = product.image.split("/");
      const publicIdWithExt = parts.slice(-2).join("/"); 
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); 

      await cloudinary.uploader.destroy(publicId);
    }

    await ProductModel.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put("/update-product/:id", parser.single("image"), async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    const updateData = {
      id: req.body.id,
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      subCategory: req.body.subCategory,
      section: req.body.section,
      star: req.body.star,
      newPrice: req.body.newPrice,
      oldPrice: req.body.oldPrice,
      discount: req.body.discount,
      saveAmount: req.body.saveAmount,
      size: req.body.size,
    };

    if (req.file) {
      updateData.image = req.file.path; 
    }

    await ProductModel.findByIdAndUpdate(req.params.id, updateData);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/delete-user/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/update-user/:id", async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { email: req.body.email }, 
      { new: true }
    );

    res.json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.log("Error fetching single product:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/place-order", async (req, res) => {
  try {
    const { user_id, email, items, totalPrice } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }
    const order = new OrderModel({user_id: new mongoose.Types.ObjectId(user_id),email,items,totalPrice,datetime: new Date(),status: "Pending"});
    await order.save();
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    console.log("Order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/user-orders/:id", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    
    const items = order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,   
      productName: item.snapName, 
      image: item.snapImage,      
      price: item.snapPrice       
    }));

    const updatedOrder = {
      ...order._doc,
      items
    };
    res.json([updatedOrder]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find();
    const products = await ProductModel.find();
    const updatedOrders = orders.map(order => {
      const items = order.items.map(item => {
        const product = products.find(
          p => String(p.id) === String(item.productId)
        );
        return {...item,productDetails: product
        };
      });
      return { ...order._doc, items };
    });
    res.json(updatedOrders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/order/:id", async (req,res)=>{
  try{
    const order = await OrderModel.findById(req.params.id);
    res.json(order);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"});
  }
});

app.delete("/delete-order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found in database" });
    }

    res.json({ message: "Specific order deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/update-order/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

   if (status === "Processed" || status === "Delivered") {
    const products = await ProductModel.find();
    const amount = order.totalPrice;
    const date = order.datetime ? new Date(order.datetime).toLocaleString() : "N/A";
    const productList = order.items.map(item => {
      const product = products.find(p => String(p.id) === String(item.productId));
      return `<li>${product?.name || "Product"} (x${item.quantity})</li>`;
    }).join("");
    const subject = `Order Update: ${status}`;
    const message = `<p>Your order is being :${status}<br/>
        <ul>${productList}</ul>
        Total: ₹${amount} <br/>
        Date: ${date} <br/> 
      </p>`;
    await sendMail(order.email, subject, message);
  }
    res.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cart-products", async (req, res) => {
  try {
    const ids = req.body;
    const products = await ProductModel.find({id: { $in: ids }});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

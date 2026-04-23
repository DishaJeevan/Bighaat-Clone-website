const express=require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const cors=require("cors");
const UserSchema =require("./models/User");
const sendMail=require("./mailsend");
const otpGenerator=require ("otp-generator");
const ProductSchema=require("./models/Product").schema;
const {OrderSchema}=require("./models/Order");
const Razorpay=require("razorpay");
// https://github.com/foliojs/pdfkit?tab=readme-ov-file
const pdfService = require("./pdf-server");
const ContactSchema = require("./models/Contact");



const app=express();
const PORT=process.env.PORT ||3001;

const multer=require("multer");
const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary")


app.use(express.json());
const allowedOrigins=[
   "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://bighaat-clone-website.onrender.com"
];

app.use(cors({
origin:function (origin,callback){
  if(!origin || allowedOrigins.includes(origin)){
    callback(null,true);
  }else{
    callback(new Error("Cors not allowed"));
  }
},credentials:true}));

// const multer=require("multer");
// const path=require("path");
// const storage=multer.diskStorage({
// destination:function(req,file,cb){
// cb(null,"uploads/");
// },
// filename:function(req,file,cb){
// cb(null,Date.now()+path.extname(file.originalname));
// }
// });
// const upload=multer({storage:storage});
// app.use("/uploads",express.static("uploads"));

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

const parser= multer({
  storage:new CloudinaryStorage({
    cloudinary,
    params:{
      folder:"products",
      format:async(req,file)=>{
        const ext=file.mimetype.split("/")[1].toLowerCase();
        const allowedFormats=["jpeg","jpg","png","webp"];
        return allowedFormats.includes(ext)?ext:"png";
      },
      public_id:(req,file)=>`${Date.now()}-${file.originalname.replace(/\s+/g,"_")}`
    }
  })
});

const razorpay=new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
   key_secret:process.env.RAZORPAY_KEY_SECRET,
});

const userDB=mongoose.createConnection(process.env.USER_DB_URI);
const adminDB=mongoose.createConnection(process.env.ADMIN_DB_URI);

userDB.once("open",()=>console.log("Login DB Connected"));
adminDB.once("open",()=>console.log("Admin DB Connected"));

const UserModel=userDB.model("users",UserSchema);
const ProductModel=adminDB.model("products",ProductSchema);
const OrderModel=adminDB.model("orders",OrderSchema);
const ContactModel = adminDB.model("contacts", ContactSchema);

function generateOTP(){
  return otpGenerator.generate(4,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false,
  });
}

function createOTP(){
  const otp=generateOTP();
  const expiry=Date.now()+5*60*1000;
  return {otp,expiry};
}

app.post("/login",async(req,res)=>{
  try{
    const{email}=req.body;
    if(!email){
      return res.status(400).json({error:"Email required"});
    }
    let user=await UserModel.findOne({email});
    const now=new Date();
    if(user && user.otp && user.otpExpires>now){
      await sendMail(
        email,
        "Your Otp for Login",
        `<h3>${user.otp} is your login OTP.It is valid for the next  Minutes.Do not share your OTP.</h3>`
      );
      return res.json({message:"OTP Sent Succesfully"});
    }
    const otp=generateOTP();
    const otpExpires=new Date(Date.now()+5*60*1000);

    if(!user){
      user=await UserModel.create({email,otp,otpExpires});
    }else{
      user.otp=otp;
      user.otpExpires=otpExpires;
      await user.save();
    }
    await sendMail(
      email,
       "Your Otp for Login",
        `<h3>${otp} is your login OTP.It is valid for the next  Minutes.Do not share your OTP.</h3>`
      );
      res.json({message:"OTP Sent Succesfully"});
    }catch(err){
      console.error("SERVER ERROR:",err);
      res.status(500).json({error:"Server Error"});
    }
});

app.post("/verify-otp",async(req,res)=>{
  try{
    const {email,otp}=req.body;
    const user=await UserModel.findOne({email});

    if(!user){
      return res.status(400).json({error:"User not found"});
    }

    if(user.otp !==otp){
      return res.status(400).json({error:"Invalid Otp"});
    }

    if(user.otpExpires <new Date()){
      return res.status(400).json({error:"Otp Expired"});
    }
    res.json({
      message:"OTP verified Successfully",
      email:user.email,
      user_id:user._id
    });
  }catch(err){
    console.log("Verification error:",err);
    res.status(500).json({error:"Server Error"})
  }
});

app.post("/resend-otp",async(req,res)=>{
  try{
    const{email}=req.body;
    console.log("Resend Otp route called for:",email);
    if(!email){
      return res.status(400).json({error:"Email Required"});
    }

    const user=await UserModel.findOne({email});
    if(!user){
      return res.status(400).json({error:"User Not found"});
    }

    const now=new Date();

    if(user.otp && user.otpExpires>now){
      await sendMail(
        email,
        "Your Otp for Login",
        `<h3>${user.otp} is your login OTP.It is valid for the next  Minutes.Do not share your OTP.</h3>`
      );
      return res.json({message:" Same OTP Resend Succesfully"});
    }
    const newOtp=generateOTP();
    const otpExpires=new Date(Date.now()+5*60*1000);
    user.otp=newOtp;
    user.otpExpires=otpExpires;
    await user.save();
    await sendMail(
        email,
        "Your Otp for Login",
        `<h3>${user.otp} is your login OTP.It is valid for the next five Minutes.Do not share your OTP.</h3>`
      );
     res.json({message:"New Otp generated"});
    }catch(error){
      console.error("Resend Error:",error);
      res.status(500).json({error:"Server Error"})
    }
});

app.post("/add-product",parser.single("image"),async(req,res)=>{
  console.log("Received file:",req.file);
  console.log("Request body:",req.body);
  try{
    const product=new ProductModel({
      id:req.body.id,
      name:req.body.name,
      brand:req.body.brand,
      category:req.body.category,
      subCategory:req.body.subCategory,
      section:req.body.section,
      newPrice:req.body.newPrice,
      oldPrice:req.body.oldPrice,
      discount:req.body.discount,
      saveAmount:req.body.saveAmount,
      image:req.file?req.file.path:"",
      createdAt:new Date(),
    });
    await product.save();
    res.json({message:"Product added successfully",product});
   }catch(err){
      console.error(err);
      res.status(500).json({error:"Server Error"})
    }
  });

  app.get("/products",async(req,res)=>{
    try{
      const keyword=req.query.keyword?{
        name:{
          $regex:req.query.keyword,
          $options:"i",
        },
      }:{};

      const products=await ProductModel.find({...keyword});

      res.json(products);
    }catch(err){
      console.error(err);
      res.status(500).json({error:"Server Error"})
    }
  });

 app.delete("/delete-product/:id",async(req,res)=>{ 
try{
  const product=await ProductModel.findById(req.params.id);

  if(product && product.image){
    const parts=product.image.split("/");
    const publicIdWithExt=parts.slice(-2).join("/");
    const publicId=publicIdWithExt.replace(/\.[^/.]+$/,"");

    await cloudinary.uploader.destroy(publicId);
  }

  await ProductModel.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
}catch(err){
      console.log(err);
      res.sendStatus(500)
    }
});

app.put("/update-product/:id",parser.single("image"),async(req,res)=>{
  try{
    const product=await ProductModel.findById(req.params.id);
    if(!product)return res.status(404).send("product not found");

    const updateData ={
      id:req.body.id,
      name:req.body.name,
      brand:req.body.brand,
      category:req.body.category,
      subCategory:req.body.subCategory,
      section:req.body.section,
      star:req.body.star,
      newPrice:req.body.newPrice,
      oldPrice:req.body.oldPrice,
      discount:req.body.discount,
      saveAmount:req.body.saveAmount,
      updatedAt: new Date(),
    };

    if(req.file){
      if(product.image && product.image.includes("cloudinary")){
        try{
          const urlParts=product.image.split("/");
          const uploadIndex=urlParts.indexOf("upload");
          let publicIdParts=urlParts.slice(uploadIndex +1);
          if(publicIdParts[0].startsWith("v")){


           publicIdParts.shift();
          }
          const publicId=publicIdParts.join("/").replace(/\.[^/.]+$/,"");
          console.log("Deleting:",publicId);

          await cloudinary.uploader.destroy(publicId);
        }catch(clErr){
          console.error("Cloudinary delete error:",clErr);
        }
      }
      updateData.image=req.file.path;
    }else{
      updateData.image=product.image;
    }
    await ProductModel.findByIdAndUpdate(req.params.id,updateData);
    res.sendStatus(200);
  }catch(err){
    console.error("Update error:",err);
    res.status(500).send("Server Error");
  }  
});

app.get("/users",async(req,res)=>{
  try{
    const users=await UserModel.find();
    res.json(users);
  }catch(err){
    res.status(500).json("Server Error");
  } 
});

app.delete("/delete-user/:id",async(req,res)=>{
  try{
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({message:"User deleted succesfully"});
  }catch(err){
    res.status(500).json("Server Error");
  }
});

app.put("/update-user/:id",async(req,res)=>{
  try{
    const {email,address}=req.body;
    const updateUser=await UserModel.findByIdAndUpdate(req.params.id,{$set:{
      email:email,
      address:address
    }
  },{new:true,runValidators:true}
);
if(!updateUser)return res.status(404).json({error:"User not found"});

res.json({message:"User Updated Succesffuly",user:updateUser});
  }catch(err){
    console.error("Update error:",err);
    res.status(500).json({error:"Server error"});
  }
});

app.get("/products/:id",async(req,res)=>{
  try{
    const product=await ProductModel.findOne({id:req.params.id});

    if(!product){
      return res.status(404).json({error:"Product not found"});
    }
    res.json(product);
  }catch(err){
    console.log("Error fetching single product:",err);
    res.status(500).json({error:"Server error"});
  }
});

app.post("/place-order", async (req, res) => {
  try {
    const {
      user_id,
      email,
      items,
      totalPrice,
      address,
      paymentMethod,
      paymentStatus,
      razorpay_order_id,
      razorpay_payment_id,
    } = req.body;

    const order = new OrderModel({
      user_id: new mongoose.Types.ObjectId(user_id),
      email,
      items,
      totalPrice,
      address,
      paymentMethod,
      paymentStatus,
      razorpay_order_id,
      razorpay_payment_id,
      status: "Pending",
      datetime: new Date(),
    });

    await order.save();

     if ((paymentMethod === "ONLINE" && paymentStatus === "Paid") || paymentMethod === "COD") {

      const buffers = [];

      pdfService.buildPDF(
        order,
        (chunk) => buffers.push(chunk),
        async () => {
          const pdfData = Buffer.concat(buffers);

         

         const subject = paymentMethod === "COD" ? "Order Confirmed - Cash on Delivery" : "Payment Successful & Invoice";

          const message = `
            <h2><strong>Payment Successful</strong></h2>
            <p>Your order has been placed successfully.</p>

          

              <p><strong>Total:</strong> ₹${totalPrice}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            
              <p><strong>Please find your invoice attached.</strong></p>
          `;

          await sendMail(email, subject, message, [
            {
              filename: "invoice.pdf",
              content: pdfData,
            },
          ]);
        }
      );
    }

    res.json({ message: "Order placed successfully" });

  } catch (err) {
    console.log("Order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/user-orders/:id",async(req,res)=>{
  try{
    const idFromUrl=req.params.id;
    const mongoUserId=new mongoose.Types.ObjectId(idFromUrl);
    const orders=await OrderModel.find({user_id:mongoUserId});
    res.json(orders);
  }catch(err){
    console.log("Error fetching the user orders:",err);
    res.status(500).json({error:"Server error"});
}})

app.get("/orders",async(req,res)=>{
  try{
    const orders = await OrderModel.find();
    const products = await ProductModel.find();
    const updatedOrders =orders.map(order =>{
      const items =order.items.map(item=>{
        const product = products.find(p=>String(p.id)===String(item.productId));
        return{...item,productDetails:product};

      });
     return{...order._doc,items};

    });
     res.json(updatedOrders);
  }catch(err){
   res.status(500).json({error:"Server error"});
  }
});

app.get("/order/:id",async(req,res)=>{
  try{
    const order=await OrderModel.findById(req.params.id);
    res.json(order);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"});
  }
});

app.delete("/delete-order/:id",async(req,res)=>{
  try{
    const orderId=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(orderId)){
      return res.status(400).json({message:"Invalid order id"});
    }
    const deleteOrder=await OrderModel.findByIdAndDelete(orderId);
    if(!deleteOrder){
      return res.status(404).json({message:"Order not found"});
    }
    res.json({message:"Specific order deleted Successfully"});
  }catch(err){
    console.error("Delete error:",err);
   res.status(500).json({error:"Server error"});
  }
});

app.put("/update-order/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };

   
    if (status === "Delivered") {
      updateData.paymentStatus = "Paid";
    }

 
    const order = await OrderModel.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "Processed" || status === "Delivered"|| status === "Shipped"|| status === "Pending") {
      const amount = order.totalPrice;
      const date = new Date(order.datetime).toLocaleString("en-IN", {
           timeZone: "Asia/Kolkata",
           hour12: false,
         });
      const productList = order.items.map(item => {
       return `
          <tr>
            <td>${item.snapName}</td>
            <td>${item.quantity}</td>
            <td>₹${item.snapPrice}</td>
          </tr>
        `;
      }).join("");

      const subject = `Order Update: ${status}`;

    
      const message = `
        <h2><strong>Order Status Update</strong></h2>
        <p>Your order status is: <strong>${status}</strong></p>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${productList}
          </tbody>
        </table>

        <p><strong>Total:</strong> ₹${amount}</p>
        <p><strong>Date:</strong> ${date}</p>
      `;
      await sendMail(order.email, subject, message);
    }  
    res.json({ message: "Order updated successfully" });
    
  } catch (err) {
    console.error("Order update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/cart-products",async(req,res)=>{
  try{
    const ids=req.body;
    const products=await ProductModel.find({id:{$in:ids}});
    res.json(products);
  }catch(err){
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/save-address",async(req,res)=>{
  try{
    const {user_id,address}=req.body;
    const id=new mongoose.Types.ObjectId(user_id);
     
   const updatedUser =await UserModel.findByIdAndUpdate(id,{$set:{address:address}},
    {new:true,runValidators:true,strict:false}
   );
   if(!updatedUser) return res.status(400).json({error:"User not found"});
   console.log("Success! Saved Address:",updatedUser.address);
   res.json(updatedUser.address);
  }catch(err){
    console.log("Save error:",err);
    res.status(500).json({error:"Server error"});
  }
});

app.get("/get-address/:id",async(req,res)=>{
  try{
    const user=await UserModel.findById(req.params.id).lean();
    if(!user){
      return res.status(404).json({error:"User not found"});
    }
    if(user.address && user.address.name){
      res.json(user.address);
    }else{
      res.json({});
    }
  }catch(err){
      res.status(500).json({error:"Server error"});
    }
  });

  // https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/
  // https://stackoverflow.com/questions/78006605/razorpay-payment-integration-in-mern
  // https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/configure-payment-methods/sample-code/
app.post("/create-razorpay-order",async(req,res)=>{
  try{
    const {amount}=req.body;
    const options={
      amount:amount*100,
      currency:"INR",
      receipt:"order_"+Date.now()
    };
    const order=await razorpay.orders.create(options);
    res.json(order);
  }catch(err){
    console.error("Razorpay error:",err);
    res.status(500).json({error:"Payment creation failed"});
  }
});

app.get("/invoice/:id", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    });

    pdfService.buildPDF(
      order,
      (chunk) => res.write(chunk),
      () => res.end()
    );
  } catch (err) {
    res.status(500).json({ error: "Error generating invoice" });
  }
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

  
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields required" });
    }

   
    const contact = new ContactModel({
      name,
      email,
      message,
      createdAt: new Date()
    });

    await contact.save();

    res.json({ message: "Message saved successfully" });

  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

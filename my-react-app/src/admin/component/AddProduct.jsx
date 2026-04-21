import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function  AddProduct (){
 const navigate = useNavigate();
 
  const [product, setProduct] = useState({
    id: "",
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    section: "",
   
    newPrice: "",
    oldPrice: "",
    discount: "",
    saveAmount: "",
  
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setProduct({ ...product, image: files[0] });
    } else {
      const updatedProduct = { ...product, [name]: value };

      const oldPrice = Number(updatedProduct.oldPrice);
      const newPrice = Number(updatedProduct.newPrice);

      if (oldPrice && newPrice) {
        const saveAmount = oldPrice - newPrice;
        const discount = Math.round((saveAmount / oldPrice) * 100);
        updatedProduct.saveAmount = saveAmount;
        updatedProduct.discount = discount;
      }

      setProduct(updatedProduct);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
   if (!product.name || !product.newPrice || !product.category) {
    alert("Please fill Name, Price and Category");
    return;
  }

  const formData = new FormData();
  

  Object.keys(product).forEach((key) => {
    if (key !== "image") {
      formData.append(key, product[key]);
    }
  });


  if (product.image) {
    formData.append("image", product.image);
  }

  try {
    const res = await axios.post(
      "https://bighaat-clone.onrender.com/add-product",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    alert("Product Added Successfully");
    console.log(res.data);
    navigate("/admin/manage-product");
  } catch (err) {
    console.error("Upload error:", err);
    alert("Failed to add product");
  }
};


return(
<>
    <div className="add-card">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <input  type="number" name="id" placeholder="Product ID" onChange={handleChange}/>
        <input  type="text" name="name" placeholder="Product Name" onChange={handleChange}/>
        <input  type="text" name="brand" placeholder="Brand" onChange={handleChange}/>

          <select name="category" onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="seeds">Seeds</option>
            <option value="sprayers">Sprayers</option>
            
            <option value="cropprotection">Crop Protection</option>
            <option value="equipments">Equipment</option>
            <option value="organic">Organic Farming</option>
            <option value="animalhusbandry">Animal Husbandry</option>
            <option value="pest">Pest</option>
            <option value="smartFarming">Smart Farming</option>
            <option value="tapas">Tapas</option>
          </select>

          <select name="subCategory" onChange={handleChange}>
              <option value="">Select Sub Category</option>
              <option value="offers">Offers</option>
              <option value="seeds">Seeds</option>
              <option value="cropnutrition">Nutrients</option>
              <option value="flower-fruits">Flower & Fruits</option>
              <option value="green-leaves">Green Leaves</option>
              <option value="nutrient-deficiencies">Nutrient Deficiencies</option>
              <option value="growth-promoters">Growth Promoters</option>
              <option value="equipments">Equipment</option>
              <option value="organic">Organic Farming</option>
              <option value="animalhusbandry">Animal Husbandry</option>
              <option value="thrips">Thrips</option>
              <option value="leaf-eating">Leaf Eating</option>
              <option value="late-blight">Late Blight</option>
              
               <option value="tapasimplements">Implements</option>
               <option value="tapasnutrition">Crop Nutrition</option>
               <option value="tapasprotection">Crop Protection</option>
              <option value="growth-promoters">Growth Promoters</option>
            </select>
            
          <select name="section" onChange={handleChange}>
            <option value="">Select Section</option>
            <option value="todaysOffer">Todays Offer</option>
            <option value="bestSelling">Best Selling</option>
            <option value="growthPromoter">Growth Promoters</option>
            
            <option value="sprayers">Sprayers Section</option>
            <option value="seeds">Seeds Section</option>
            <option value="cropnutrition">Nutrients Section</option>
            <option value="cropprotection">Crop Protection Section</option>
            <option value="equipments">Equipment Section</option>
            <option value="organic">Organic Section</option>
            <option value="animalhusbandry">Animal Husbandry Section</option>
            <option value="pest">Pest Section</option>
            <option value="smartFarming">Smart Farming</option>
          </select>

    
          <input  type="number" name="newPrice" placeholder="New Price" onChange={handleChange}/>
          <input  type="number" name="oldPrice" placeholder="Old Price" onChange={handleChange}/>
          <input type="text" name="discount" placeholder="Discount" value={product.discount}/>
          <input type="number" name="saveAmount" placeholder="Save Amount" value={product.saveAmount}/>     
          
          <input  type="file" name="image"  onChange={handleChange}/>
          <button type="submit">Add Product</button>
      </form>
    </div>
</>
);
}
 export default AddProduct;

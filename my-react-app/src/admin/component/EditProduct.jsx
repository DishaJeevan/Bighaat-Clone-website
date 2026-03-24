import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  useEffect(() => {
      const fetchProduct = async () => {
        try {
          const res = await axios.get("https://bighaat-clone.onrender.com/products");
          const product = res.data.find((p) => p._id === id);
          if (product) {
            setFormData(product); 
          }
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      };

      fetchProduct();
    }, [id]);

      function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        if (name === "image") {
          setFormData({ ...formData, image: e.target.files[0] });
        } else {
          const updatedData = {...formData,[name]: value};
          const oldPrice = Number(updatedData.oldPrice);
          const newPrice = Number(updatedData.newPrice);
          
          if (oldPrice && newPrice) {
            const saveAmount = oldPrice - newPrice;
            const discount = Math.round((saveAmount / oldPrice) * 100);
            updatedData.saveAmount = saveAmount;
            updatedData.discount = discount;
          }
          setFormData(updatedData);
        }
      }
  
      const handleUpdate = async (e) => {
          e.preventDefault();
          const data = new FormData();        
          for (let key in formData) {        
            if (key === "image") {
              if (formData.image instanceof File) {
                data.append("image", formData.image);       
              }      
            } else {     
              data.append(key, formData[key]);        
          }
      }
        try {     
          await axios.put(`https://bighaat-clone.onrender.com/update-product/${id}`, data,{ headers: { "Content-Type": "multipart/form-data" } } );
          alert("Product Updated Successfully");      
          navigate("/admin/manage-product");
          } catch (err) {        
            console.error(err);        
            alert("Update failed");        
          }       
        };
  
  return(
    <>
    <div className="add-card">
      <h2>Edit Product</h2>
      <form onSubmit={handleUpdate} className="product-form">
        <input type="number" name="id" value={formData.id} onChange={handleChange}/>
        <input type="text" name="name" value={formData.name} onChange={handleChange}/>
        <input type="text" name="brand" value={formData.brand} onChange={handleChange}/>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select Category</option>
            <option value="seeds">Seeds</option>
            <option value="sprayers">Sprayers</option>
            <option value="cropnutrition">Nutrients</option>
            <option value="cropprotection">Crop Protection</option>
            <option value="equipments">Equipment</option>
            <option value="organic">Organic Farming</option>
            <option value="animalhusbandry">Animal Husbandry</option>
            <option value="pest">Pest</option>
            <option value="smartFarming">Smart Farming</option>
            <option value="tapas">Tapas</option>
        </select>

        <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
           <option value="">Select Sub Category</option>
              <option value="offers">Offers</option>
              <option value="seeds">Seeds</option>
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

        <select name="section" value={formData.section} onChange={handleChange}>
            <option value="">Select Section</option>
            <option value="todaysOffer">Todays Offer</option>
            <option value="bestSelling">Best Selling</option>
            <option value="growthPromoter">Growth Promoters</option>
        </select>

        <input type="text" name="star" value={formData.star} onChange={handleChange}/>
        <input type="number" name="newPrice" value={formData.newPrice} onChange={handleChange}/>
        <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange}/>
        <input type="text" name="discount" placeholder="Discount" value={formData.discount ||""}/>
        <input type="number" name="saveAmount" placeholder="Save Amount" value={formData.saveAmount|""}/>
        <input type="text" name="size" value={formData.size || ""} placeholder="Enter sizes" onChange={handleChange} />
        <input type="file" name="image" onChange={handleChange}/>

        <button type="submit">Update Product</button>
      </form>
    </div>
    </>
  );
}

export default EditProduct; 

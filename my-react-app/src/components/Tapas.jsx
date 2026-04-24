import { Link } from "react-router-dom";
import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Tapasimplements from "../components/Tapasimplements";
import Tapascropnutrition from "../components/Tapascropnutrition";
import Tapascropprotection from "../components/Tapascropprotection";

function Tapas() {
 const [implementsProducts, setImplementsProducts] = useState([]);
  const [nutritionProducts, setNutritionProducts] = useState([]);
  const [protectionProducts, setProtectionProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/products");
        const products = res.data;

        setImplementsProducts(products.filter(p => p.subCategory === "tapasimplements"));
        setNutritionProducts(products.filter(p => p.subCategory === "tapasnutrition"));
        setProtectionProducts(products.filter(p => p.subCategory === "tapasprotection"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);
  
  return (
    <>
      <div className="tapashero">
        <img  src="/images/Tapas-Hero-Banner.avif"  alt="Tapas Hero"   style={{ width: "100%" }}  />
      </div>
     <div className="para">
      <Link to="/" className="home-link">Home</Link>
      <span> Tapas Product</span>
    </div>

    <section className="categories-tapas">
      <h1>Categories</h1>

      <div className="categories-tapas-box">
        <Link to="/tapasimplements" className="category-tapas-section">
          <img src="/images/TapasImplementsimg.webp" alt="offers" />
          <p>Implements</p>
        </Link>

        <Link to="/tapasnutrition" className="category-tapas-section">
          <img src="/images/Tapas_crop_Nutritionimg.webp" alt="insecticides" />
          <p>Crop Nutrition</p>
        </Link>

        <Link to="/tapasprotection" className="category-tapas-section">
          <img src="images/Tapas_crop_protection.webp" alt="nutrients" />
          <p>Crop Protection</p>
        </Link>
        </div>
      </section>

      <section className="implements-home">
         <div className="offers-price">
           <h1>Implements</h1>
          </div>
      
           <div className="offer-view-all">
             <Link to="/tapasimplements">View All</Link>
            </div>
            </section>
      
            <section className="implements-price">
             {implementsProducts.slice(0,5).map((product) => (
              <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
                <div className="product-card" key={product.id}>
                  <Link to={`/product/${product.id}`}>
                    
                  </Link>
              
                  <div className="discount-tapas">{product.discount}%OFF</div>
              
                  <div className="image-offer">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="rating-star-menu">
                     ₹{product.oldPrice} <i className="fa-solid fa-arrow-right"></i> ₹{product.newPrice}
                  </div>

                  <div className="content-card">
                    <h4>{product.name}</h4>
                    <p className="brand">{product.brand}</p>
              
                    <div className="price">
                      <span className="new-price">₹{product.newPrice}</span>
                      <span className="old-price">₹{product.oldPrice}</span>
                    </div>
              
                    <p className="save-button">Save ₹{product.oldPrice - product.newPrice}</p>
                  </div>
              
                 
                </div>
                </Link>
              ))}
            </section>

            <section className="protection-home">
              <div className="offers-price">
                <h1>Crop Protection</h1>                
              </div>
      
              <div className="offer-view-all">
                <Link to="/tapasprotection">View All</Link>
              </div>
            </section>
      
            <section className="protection-price">
              {protectionProducts.slice(0,5).map((product) => (
                <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
                  <div className="product-card" key={product.id}>
                    <Link to={`/product/${product.id}`}>
                      
                    </Link>
                
                    <div className="discount-tapas">{product.discount}%OFF</div>
                
                    <div className="image-offer">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="rating-star-menu">
                     ₹{product.oldPrice} <i className="fa-solid fa-arrow-right"></i> ₹{product.newPrice}
                    </div>

                   <div className="content-card">
                     <h4>{product.name}</h4>
                     <p className="brand">{product.brand}</p>
               
                     <div className="price">
                       <span className="new-price">₹{product.newPrice}</span>
                       <span className="old-price">₹{product.oldPrice}</span>
                     </div>
               
                     <p className="save-button">Save ₹{product.oldPrice - product.newPrice}</p>
                   </div>
               
                   
                 </div>
                 </Link>
               ))}
            </section>

             <section className="nutrition-home">
               <div className="offers-price">
                 <h1>Crop Nutrition</h1>
                 
               </div>
       
               <div className="offer-view-all">
                 <Link to="/tapasnutrition">View All</Link>
               </div>
             </section>
       
             <section className="nutrition-price">
              {nutritionProducts.slice(0,5).map((product) => (
               <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
               <div className="product-card" key={product.id}>
                 <Link to={`/product/${product.id}`}>
                 
                 </Link>
             
                 <div className="discount-tapas">{product.discount}%OFF</div>
             
                 <div className="image-offer">
                   <img src={product.image} alt={product.name} />
                 </div>
                 <div className="rating-star-menu">
                     ₹{product.oldPrice} <i className="fa-solid fa-arrow-right"></i> ₹{product.newPrice}
                  </div>

                  <div className="content-card">
                    <h4>{product.name}</h4>
                    <p className="brand">{product.brand}</p>
              
                    <div className="price">
                      <span className="new-price">₹{product.newPrice}</span>
                      <span className="old-price">₹{product.oldPrice}</span>
                    </div>
              
                    <p className="save-button">Save ₹{product.oldPrice - product.newPrice}</p>
                  </div>
              
                 
                </div>
                </Link>
               ))}
            </section>         
    </>
  );
}

export default Tapas;

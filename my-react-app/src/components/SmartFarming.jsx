import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import {smartAds} from "../components/Data";

function SmartFarming() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const getProducts = async () => {
    try {
      const res = await axios.get("https://bighaat-clone.onrender.com/products");
      console.log("All products:", res.data);      
      const filtered = res.data.filter((p) => p.subCategory === "equipments");
      console.log("Filtered equipments:", filtered);  
      setProducts(filtered);
    } catch (err) {
      console.error(err);
    }
  };
  getProducts();
}, []);
 
   return (
    <>
        <section className="smart-farming">
          <div className="offers-price">
            <h1>Smart Farming</h1>
            <p>Modern Tools for Today’s Farming</p>
          </div>
        
          <div className="offer-view-all">
            <Link to="/equipments">View All</Link>
          </div>
        </section>
        
        <section className="smart-price">
          {products.map((product, index) => (
            <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
          <div className="product-card" key={`${product.id}-${index}`}>
              <Link to={`/product/${product.id}`}>
               
              </Link>
        
              {product.discount && <div className="discount">{product.discount}% OFF</div>}
        
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
        
               <p className="save-button">Save ₹{product.saveAmount}</p>
              </div>
        
            </div>
            </Link>
          ))}
          </section>
          
          <div className="smart-offer-img">
            <img src="/images/chrome_LE00ogIRqe123.png" alt="smartimage" />
          </div>
          <div className="smart-offerad-box">
            {smartAds.map((ad) => (
              <Link key={ad.id} to={ad.link} className="growth-offerad-section">
                <span className="ad-tag-smart">Ad</span>
                <img src={ad.image} alt="smart-ad" />
              </Link>
              
            ))}
          </div>
        </>
  );
}

export default SmartFarming;

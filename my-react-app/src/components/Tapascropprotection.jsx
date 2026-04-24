import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

function Tapascropprotection () {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://bighaat-clone.onrender.com/products");
      const filtered = res.data.filter(p => p.subCategory === "tapasprotection");
      setProducts(filtered);
    } catch (err) {
      console.error(err);
    }
  };
  fetchProducts();
}, []);


  return (
  <div className="tapasprotection-page">
    <div className="main-container"></div>

        <div className="products-grid-menu">
          {products.map((product) => (
            <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
            <div className="product-card-menu" key={product.id}>

              <div className="discount-menu">
                {product.discount}% OFF
              </div>
            
              <div className="image-offer-menu">
                <img src={product.image} alt={product.name} />
              </div>

            <div className="rating-star-menu">
                ₹{product.oldPrice} <i className="fa-solid fa-arrow-right"></i> ₹{product.newPrice}
              </div>
              <div className="content-card-menu">
                <h4>{product.name}</h4>
                <p className="brand-menu">{product.brand}</p>

                <div className="price-menu">
                  <span className="new-price-menu">₹{product.newPrice}</span>
                  <span className="old-price-menu">₹{product.oldPrice}</span>
                </div>

                 <p className="save-button">Save ₹{product.saveAmount}</p>
              </div>
              
          </div>
          </Link>
        ))}

        </div>

        <div class="end-section">
          <div class="end-box">
            You have reached the end...
          </div>
          </div>
         
      </div>
   
  );
}

export default Tapascropprotection ;

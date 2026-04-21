
import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function GrowthPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/products");
        const filtered = res.data.filter(
  (p) => p.subCategory === "growth-promoters"
);
     

      setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="seeds-page">
      <div className="main-container">
        
          </div>

          <div className="products-grid-menu">
            {products.map((product) => (
              <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
                <div className="product-card-menu">
                  <div className="discount-menu">
                    {product.discount}% OFF
                  </div>

                  <span className="wishlist-icon">
                    <i className="fa-regular fa-heart"></i>
                  </span>

                  <div className="image-offer-menu">
                    <img src={product.image} alt={product.name}/>
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

          <div className="end-section">
            <div className="end-box">You have reached the end...</div>
          </div>

        
        </div>
     
  );
}

export default GrowthPage;

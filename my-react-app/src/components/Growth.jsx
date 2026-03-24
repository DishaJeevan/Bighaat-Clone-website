import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function Growth() {
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

  const homeProducts = products.slice(0, 5); 

  return (
    <>
      <section className="growth-promoters">
        <div className="offers-price">
          <h1>Growth Promoters ✨</h1>
          <p>Boost crop Growth naturally.</p>
        </div>

        <div className="offer-view-all">
          <Link to="/growth-promoters">View All</Link>
        </div>
      </section>

      <section className="growth-price">
        {homeProducts.map((product, index) => (
          <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
          <div className="product-card" key={`${product.id}-${index}`}>
            <Link to={`/product/${product.id}`}>
              <i className="fa-regular fa-heart"></i>
            </Link>

            <div className="discount">{product.discount}% OFF</div>

            <div className="image-offer">
              <img
                src={product.image}
                alt={product.name}
              />
            </div>

            <div className="rating-star-menu">{product.star}</div>

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
    </>
  );
}

export default Growth;
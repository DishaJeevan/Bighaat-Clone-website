import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function SprayersandNutrients() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/products");
        const filtered = res.data.filter((p) => p.category === "sprayers");
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    getProducts();
  }, []);

  
  return (
    <>
      <section class="sprayers">
        <div class="offers-price">
          <h1>Sprayers</h1>
          <p>Reliable Sprayers Built for Indian Farms</p>
        </div>
        <div class="offer-view-all">
          <a href="tapasimplements">View All</a>
        </div>
      </section>
      <section className="sprayer-price">
         {products.map((product) => (
          <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
          <div className="product-card" key={product.id}>
            <div className="discount">{product.discount}% Off</div>

            <div className="image-offer">
              <img src={product.image} alt={product.name}
              />
            </div>

              <div className="rating-star-menu">
                ₹{product.oldPrice} <i className="fa-solid fa-arrow-right"></i> ₹{product.newPrice}
              </div>
            <div className="content-card">
              <h4>{product.name}</h4>
              <p className="brand">{product.brand}</p>

              <div className="price">
                <span className="new-price">{product.newPrice}</span>
                <span className="old-price">{product.oldPrice}</span>
              </div>

                <p className="save-button">Save ₹{product.saveAmount}</p>
            </div>

            
          </div>
          </Link>
        ))}
      </section>

      <div class="sparayer-offer-img">
        <img src="images/sprayerofferimg.png" alt="smartimage" />
      </div>    
    </>
  );
}

export default SprayersandNutrients;

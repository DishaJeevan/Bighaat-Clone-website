import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function SeedsSection() {
  const [seedProducts, setSeedProducts] = useState([]);
  useEffect(() => {
  const getSeeds = async () => {
    try {
      const res = await axios.get("https://bighaat-clone.onrender.com/products");

      const filtered = res.data.filter(
        (p) => p.category === "seeds"
      );

      setSeedProducts(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  getSeeds();
}, []);
  return (
    <>

    <section class="seeds">
            <div class="offers">
                <h1>Seeds</h1>
                <p>Quality Seeds, Proven Results</p>
            </div>
            <div class="offer-view-all">
                <Link to="/Seedsmenue">View All</Link>
            </div>
        </section>
<section className="card-seed">
      {seedProducts.slice(0, 5).map((product) => (
        <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
          <div className="product-card" key={product.id}>
            <div className="discount">{product.discount}% Off</div>

            <div className="image-offer">
              <img src={product.image} />
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
      </>
      );
}

export default SeedsSection;

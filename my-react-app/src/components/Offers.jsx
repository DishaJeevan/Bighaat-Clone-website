import { Link } from "react-router-dom";
import "../App.css";

import { useState, useEffect } from "react";
import axios from "axios";

function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/products");
        const filtered = res.data.filter(p => p.section === "todaysOffer");
        setOffers(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOffers();
  }, []);
  return (
    <>
      <section className="todays-offer">
        <div className="offers">
          <h1>Today’s Offer ⚡</h1>
          <p>Best prices available today.</p>
        </div>

        <div className="offer-view-all">
          <Link to="/offer-page">View All</Link>
        </div>
      </section>

      <section className="card-offer">
       {offers.slice(0,5).map((product) => (
        <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
          <div className="product-card" key={product.id}>
            <Link to={`/product/${product.id}`}>
              <i className="fa-regular fa-heart"></i>
            </Link>

            <div className="discount">{product.discount}% Off</div>

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

      <div className="green-offer-img">
        <img src="/images/gree.png" alt="green-offer" />
      </div>
    </>
  );
}

export default Offers;

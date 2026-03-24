
import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function GreenLeaves() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/products");
        const filtered = res.data.filter(
        (p) => p.subCategory === "green-leaves"
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
        <div className="sidebar">
          <h2>Filters</h2>

          <details open>
            <summary>
              CATEGORIES
              <i className="fa-solid fa-angle-down"></i>
            </summary>
            <div className="content">
              <label><input type="checkbox" /> Seeds</label>
            </div>
          </details>

          <details>
            <summary>
              BRANDS
              <i className="fa-solid fa-angle-down"></i>
            </summary>
            <div className="content">
              <label><input type="checkbox" /> Aqunata</label>
              <label><input type="checkbox" /> AgroHaat</label>
              <label><input type="checkbox" /> Pioneer Agro</label>
              <label><input type="checkbox" /> Solar</label>
              <label><input type="checkbox" /> Sarpan Hybrid Seeds Co</label>
            </div>
          </details>

          <details open>
            <summary>
              PRICE
              <i className="fa-solid fa-angle-down"></i>
            </summary>
            <div className="content">
              <input type="range" min="0" max="20000" className="range" />
              <div className="price-box">
                <select>
                  <option>₹0</option>
                  <option>₹1000</option>
                  <option>₹5000</option>
                </select>
                <span>to</span>
                <select>
                  <option>₹20000</option>
                  <option>₹15000</option>
                  <option>₹10000</option>
                </select>
              </div>
            </div>
          </details>

          <details>
            <summary>
              RATING
              <i className="fa-solid fa-angle-down"></i>
            </summary>
            <div className="content">
              <label><input type="checkbox" /> 5 Star</label>
              <label><input type="checkbox" /> 4 Star</label>
              <label><input type="checkbox" /> 3 Star</label>
              <label><input type="checkbox" /> 2 Star</label>
              <label><input type="checkbox" /> 1 Star</label>
            </div>
          </details>

          <details>
            <summary>
              AVAILABILITY
              <i className="fa-solid fa-angle-down"></i>
            </summary>
            <div className="content">
              <label><input type="checkbox" /> In Stock</label>
              <label><input type="checkbox" /> Out of Stock</label>
            </div>
          </details>
        </div>

        <div className="content-area">
          <div className="page-header">
            <div className="title-section">
              <h1>GreenLeaves <span>({products.length})</span></h1>
            </div>

            <div className="sort-section">
              <div className="sort-box">
                <span>Sort By:</span>
                <select>
                  <option>Best Selling</option>
                  <option>Price Low to High</option>
                  <option>Price High to Low</option>
                </select>
              </div>
            </div>
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
                    <img src={product.image}alt={product.name}/>
                  </div>

                  <div className="rating-star-menu">
                    {product.star}
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

          <div className="description">
            <h3>Crop Protection</h3>
            <p>
              Products are used to kill and control all harmful organisms during
              the cultivation and to improve the yield and the quality of their
              crop growth. It contains one or more active substances and other
              co-formulated can be either biological or chemical products. Bio
              and Organic Plant protection products are available with various
              top brands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GreenLeaves;
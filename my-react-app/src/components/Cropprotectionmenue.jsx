import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";


function Cropprotectionmenue  () {
  const [cropprotectionmenue, setCropprotectionmenue] = useState([]);

  useEffect(() => {
    const fetchSells = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/products");
        const filtered = res.data.filter(p => p.section === "cropprotection");
        setCropprotectionmenue(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSells();
  }, []);
  return (
  <div className="cropprotection-page">
    <div className="main-container">

   
      <div className="sidebar">
        <h2>Filters</h2>

        <details>
          <summary>CATEGORIES
            <i class="fa-solid fa-angle-down"></i>
          </summary>
          <div className="content">
            <label><input type="checkbox" />Crop Protection</label>    
          </div>
        </details>

        <details>
          <summary>BRANDS
            <i class="fa-solid fa-angle-down"></i>
          </summary>
          <div className="content">
            <label><input type="checkbox" /> Adama</label>
            <label><input type="checkbox" /> AgroHaat</label>
            <label><input type="checkbox" /> AIMCO PESTICIDES LTD</label>
            <label><input type="checkbox" /> Amruth Organic</label>
            <label><input type="checkbox" /> BASF</label>
          </div>
        </details>
        <details>
            <summary>
                PRICE
                <i class="fa-solid fa-angle-down"></i>
            </summary>
            <div class="content">
                <input type="range" min="0" max="20000" class="range"/>
                <div class="price-box">
                    <select>
                        <option>₹0</option>
                        <option>₹1000</option>
                        <option>₹5000</option>
                    </select>
                    to
                    <select>
                        <option>₹20000</option>
                        <option>₹15000</option>
                        <option>₹10000</option>
                    </select>
                </div>
            </div>
        </details>

        <details>
          <summary>RATING
            <i class="fa-solid fa-angle-down"></i>
          </summary>
          <div className="content">
            <label><input type="checkbox" /> 4 ⭐ and above</label>
            <label><input type="checkbox" /> 3 ⭐ and above</label>
            <label><input type="checkbox" /> 2 ⭐ and above</label>
            
          </div>
        </details>

        <details>
          <summary>AVAILABILITY
            <i class="fa-solid fa-angle-down"></i>
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
            <h1>Crop Protection Products online in India at BigHaat</h1>
          </div>

          <div className="sort-section">
            <div className="sort-box">
              <span>Sort By:</span>
              <select >
                <option>Best Selling</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
              </select>
            </div>
          </div>
        </div>
 
        <div className="products-grid-menu">

          {cropprotectionmenue.map((product) => (
             <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
            <div className="product-card-menu" key={product.id}>

              <div className="discount-menu">
                {product.discount}% OFF
              </div>
              <a href="#">
                    <i class="fa-regular fa-heart"></i>
                </a>

              <div className="image-offer-menu">
                <img src={product.image} alt={product.name}/>
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
              <div class="end-section">

                <div class="end-box">
                  You have reached the end...
                </div>
                </div>

  <div class="description">
    <h3>Crop Protection</h3>
    <p>
      Products are used to kill and control all harmful organisms during the cultivation 
      and to improve the yield and the quality of their crop growth. It contains one or more 
      active substances and other co-formulated can be either biological or chemical products. 
      Bio and Organic Plant protection products are available with various top brands.
    </p>
  </div>


      </div>

    </div>
    </div>
  );
}

export default Cropprotectionmenue  ;
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router-dom";


function Search () {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`https://bighaat-clone.onrender.com/products?keyword=${keyword}`)

        const filtered = res.data.filter((p) =>
  keyword? p.name.toLowerCase().includes(keyword.toLowerCase()): true
);
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    getProducts();
  }, [keyword]);
  return (
  <div className="organic-page">
    <div className="main-container">
     
      <div className="content-area">
        <div className="products-grid-menu">

          {products.map((product) => (
            <Link to={`/product/${product.id}`}  key={product.id} className="product-link">
            <div className="product-card-menu" key={product.id}>

              <div className="discount-menu">
                {product.discount}% OFF
              </div>
              <a href="#">
                    <i class="fa-regular fa-heart"></i>
                </a>

              <div className="image-offer-menu">
                <img src={product.image} />
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

                <p className="save-button-menu">
                  Save ₹{product.oldPrice - product.newPrice}
                </p>
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

    </div>
    </div>
  );
}


export default Search;

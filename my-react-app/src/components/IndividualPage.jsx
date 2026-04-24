import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import AddToCart from "../components/AddToCart";
import { useContext } from "react";
import { CartContext } from "../components/CartContext";

function IndividualPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showBuyNow,setShowBuyNow] = useState(true);
  const { openCart, addToCart } = useContext(CartContext);

   useEffect(() => {
      const getProduct = async () => {
        try {
        
          const res = await axios.get(`https://bighaat-clone.onrender.com/products/${id}`);
          setProduct(res.data);
        } catch (err) {
          console.log("Error fetching product:", err);
          setProduct(null);
        }
      };
      
      if (id) {
        getProduct();
      }
    }, [id]); 

  if (!product) {
    return <h2>Product not found</h2>;
  }

  function handleBuyNow() {
    addToCart({
      id: product.id,
      name: product.name,
      newPrice: product.newPrice,
      image: product.image   
    }); 
    openCart();         
  }

  return (
  <div className="product-details-page">
    <div className="product-details-container">

      <div className="product-image-section">
        <img src={product.image}alt={product.name}/>
      </div>

      <div className="product-info-section">
        <h1>{product.name}</h1>
        <p className="details-brand"><strong>Brand:</strong> {product.brand}</p>

        <p className="details-rating-row"><span className="stars"></span> ₹{product.oldPrice} <i className="fa-solid fa-arrow-right"></i> ₹{product.newPrice}</p>

        <div className="details-price-row">
          <span className="details-new-price">₹{product.newPrice}</span>
          <span className="details-old-price">₹{product.oldPrice}</span>
          <span className="details-discount">{product.discount}% OFF</span>
        </div>

        <p className="save-text">Save ₹{product.oldPrice - product.newPrice}</p>
     
        <div className="button-row">
          <AddToCart product={product} setShowBuyNow={setShowBuyNow} /> 
          {showBuyNow && (
            <button className="buy-btn" onClick={handleBuyNow}>Buy Now</button>
          )}
        </div>

    </div>
   </div>
  </div>
);
}

export default IndividualPage;

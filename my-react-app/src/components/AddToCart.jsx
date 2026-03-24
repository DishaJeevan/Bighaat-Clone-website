import { useContext, useState } from "react";
import { CartContext } from "../components/CartContext";

function AddToCart({ product, setShowBuyNow }) {
  const { cart, addToCart, increaseQty, decreaseQty, openCart }= useContext(CartContext);
  const [added, setAdded] = useState(false); 

  if (!product) return null;
  const item = cart.find((i) => i.id === product.id);
  const qty = item ? item.qty : 0;

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      newPrice: product.newPrice,
      image: product.image   
    });     
    setAdded(true);         
    setShowBuyNow(false);    
  }

  function handleDecrease() {
    decreaseQty(product.id);
    if (qty === 1) {
      setAdded(false);       
      setShowBuyNow(true);   
    }
  }

  function handleGoToCart() {
    openCart();              
  }

  return (
    <div className="cart-container">
      {!added ? (
        <button className="cart-btn" onClick={handleAddToCart}>Add to Cart</button>
      ) : (
        <div className="after-add-section">
          <div className="qty-box">
            <button className="qty-btn" onClick={handleDecrease}>{qty === 1 ? <i className="fa-solid fa-trash"></i> : "-"}</button>
            <span className="qty-number">{qty}</span>
            <button className="qty-btn" onClick={() => increaseQty(product.id)}>+</button>
          </div>

          <button className="go-cart" onClick={handleGoToCart}>Go to Cart</button>
        </div>
      )}
    </div>
  );
}

export default AddToCart;
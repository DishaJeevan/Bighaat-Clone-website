import { useContext } from "react";
import { CartContext } from "../components/CartContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const { cart, cartWithDetails, total, increaseQty, decreaseQty, closeCart, clearCart } = useContext(CartContext);
//   const placeOrder = async () => {
//     try {
//       const email = localStorage.getItem("email");
//       const user_id = localStorage.getItem("user_id");
//       const items = cartWithDetails.map(item => ({
//       productId: item.id,
//       quantity: item.qty,
//       snapName: item.name,      
//       snapPrice: item.newPrice, 
//       snapImage: item.image
// }));

  //    const totalPrice = total;
  //   await axios.post("https://bighaat-clone.onrender.com/place-order", {user_id,email,items,totalPrice});
  //   alert("Order placed successfully");
  //    clearCart(); 
  //    closeCart();
  // } catch (err) {
  //   console.log(err);
  //   alert("Server error");
  // }
// };

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Cart </h3>
        <i className="fa-solid fa-xmark close-cart" onClick={closeCart}></i>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>No Products Added to Cart</h2>
            <Link to="/"><button className="continue-btn" onClick={closeCart}>Continue Shopping</button></Link>
          </div>
       ) : (
           cartWithDetails.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name}/>
              <div className="cart-info">
                <h4>{item.name}</h4>
                <p className="price">₹{item.newPrice}</p>
                <div className="qty-box">
                  <button onClick={() => decreaseQty(item.id)}>
                    {item.qty === 1
                      ? <i className="fa-solid fa-trash"></i> 
                      : <i className="fa-solid fa-minus"></i>
                    }
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(item.id)}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    
      {cart.length > 0 && (
        <div className="billing">
          <div className="bill-row">
            <span>Total Price</span>
            <span>₹{total}</span>
          </div>

          <div className="bill-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="total-price">₹{total}</div>
         <button 
  className="proceed-btn" 
 
   onClick={() => {
  closeCart();
  navigate("/checkout-address");
}}
  
>
  Proceed
</button>
        </div>
      )}
    </div>
  );
}

export default Cart;

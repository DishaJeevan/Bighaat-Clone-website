import { Link } from "react-router-dom";
import "../App.css";
import { useContext } from "react";
import { CartContext } from "../components/CartContext";

function Header() {
  const { cart, openCart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header>
      <div className="top-header">
        <Link to="/" className="logo">
          <img src="/images/bighaat-logo.webp" alt="BigHaat Logo" />
        </Link>

        <div className="search-box">
          <input type="text" placeholder="Search products..." />
          <button><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>

        <div className="right-links">
          <Link to="/track-order">
            <i className="fa-regular fa-truck"></i>
            Track Order
          </Link>

          <Link to="/wishlist">
            <i className="fa-regular fa-heart"></i>
            Wishlist
          </Link>

          <Link to="/Login">
            <i className="fa-regular fa-user"></i>
            Login
          </Link>

          <div className="cart-link" onClick={openCart}>
          <div className="cart-icon">
          <i className="fa-solid fa-cart-arrow-down"></i>
            {totalItems > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </div>
            Cart
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
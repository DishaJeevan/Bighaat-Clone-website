import { Link } from "react-router-dom";
import "../App.css";
import { useContext } from "react";
import { CartContext } from "../components/CartContext";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


function Header() {
  const { cart, openCart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const location = useLocation();
  const navigate=useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [address, setAddress] = useState(null);

useEffect(() => {
  const fetchAddress = () => {
    const user_id = localStorage.getItem("user_id");
    if(user_id){
      axios.get(`/get-address/${user_id}`)
        .then(res => setAddress(res.data));
    }
  };

  fetchAddress();

  window.addEventListener("storage", fetchAddress);

  return () => window.removeEventListener("storage", fetchAddress);
}, []);
 
 

useEffect(() => {
  const fetchProducts = async () => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`https://bighaat-clone.onrender.com/products?keyword=${keyword}`);

      const filtered = res.data.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );

      setResults(filtered.slice(0, 5)); 
    } catch (err) {
      console.error(err);
    }
  };

  fetchProducts();
}, [keyword]);



const handleLogout = () => {
  localStorage.removeItem("email");
  localStorage.removeItem("user_id");

  setUser(null);
  navigate("/");
};

useEffect(() => {
  const email = localStorage.getItem("email");
  setUser(email);
}, [location]);




  return (
    <header>
      <div className="top-header">
        <Link to="/" className="logo">
          <img src="/images/bighaat-logo.webp" alt="BigHaat Logo" />
        </Link>

        <div className="search-box">
        <input type="text" placeholder="Search products." value={keyword} onChange={(e) => setKeyword(e.target.value)} onFocus={() => setShowDropdown(true)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)}/>
        <button>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>

            {showDropdown && (
              <div className="search-dropdown">
                
                {results.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="dropdown-item">
              <img src={item.image} />
              <div>
                <p>{item.name}</p>
                <span className="price">₹{item.newPrice}</span>
                <span className="old-price">₹{item.oldPrice}</span>
              </div>
              
           </Link>
            
          ))}
          
    <div className="show-all" onClick={() => navigate(`/search/${keyword}`)} >Show all results for "{keyword}"</div>

    </div>
  )}
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

          <div className="user-section" onClick={() => setShowUserDropdown(!showUserDropdown)}>

          {!user ? (
            <Link to="/Login">
              <i className="fa-regular fa-user"></i>
              Login
            </Link>
          ) : (
            <div className="user-info">
              <i className="fa-regular fa-user"></i>
              BigHaat Farmer
            </div>
          )}

          {user && showUserDropdown && (
            <div className="user-dropdown">
              <p>{user}</p>
              <Link to="/orders">My Orders</Link>
             <p onClick={() => navigate("/my-address")}>
                My Address
              </p>
              
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}

        </div>

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

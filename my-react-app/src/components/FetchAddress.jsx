import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function FetchAddress() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCheckout = location.pathname === "/checkout-address";

  const [address, setAddress] = useState(null);

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
  const fetchAddress = async () => {
    if (!user_id) return; 
    try {
      const res = await axios.get(
        `https://bighaat-clone.onrender.com/get-address/${user_id}`
      );

     
      if (res.data && Object.keys(res.data).length > 0 && res.data.name) {
        setAddress(res.data);
      } else {
        setAddress(null); 
      }
    } catch (err) {
      console.log("Error fetching address", err);
      setAddress(null);
    }
  };

  fetchAddress();
}, [user_id]);

  const placeOrder = async () => {
    try {
      const email = localStorage.getItem("email");

      await axios.post("https://bighaat-clone.onrender.com/place-order", {
        user_id,
        email,
        items: [],
        totalPrice: 0,
        address,
      });

      alert("Order placed successfully");
      navigate("/orders");
    } catch (err) {
      console.log(err);
      alert("Order failed");
    }
  };

  if (!address) {
    return (
      <div className="address-card">
        <p>No address found</p>
      </div>
    );
  }

  return (
    <div className="address-card">
      <h3>{address.name}</h3>

      <p>{address.phone}</p>
      <p>{address.flat}, {address.street}</p>
      <p>{address.city}, {address.district}</p>
      <p>{address.state} - {address.pincode}</p>

      {address.landmark && <p>Landmark: {address.landmark}</p>}

      <div style={{ marginTop: "12px" }}>
        
     
        <button onClick={() => navigate("/edit-address")}>
          Edit Address
        </button>

        
        {isCheckout && (
          <button onClick={placeOrder}>
            Place Order
          </button>
        )}

      </div>
    </div>
  );
}

export default FetchAddress;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function FetchAddress() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCheckout = location.pathname === "/checkout-address";

  const [address, setAddress] = useState(null);

  const _id = localStorage.getItem("_id");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(
          `https://bighaat-clone.onrender.com/get-address/${_id}`
        );

        if (res.data && res.data.name) {
          setAddress(res.data);
        }
      } catch (err) {
        console.log("Error fetching address", err);
      }
    };

    fetchAddress();
  }, [_id]);

  const placeOrder = async () => {
    try {
      const email = localStorage.getItem("email");

      await axios.post("https://bighaat-clone.onrender.com/place-order", {
        _id,
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

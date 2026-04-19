import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import MyAddress from "./MyAddress";

function CheckoutAddress() {
  const navigate = useNavigate();
  const { cartWithDetails, total, clearCart, closeCart } = useContext(CartContext);

  const user_id = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");

  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios.get(`https://bighaat-clone.onrender.com/get-address/${user_id}`)
      .then(res => {
        if (res.data?.name) {
          setAddress(res.data);
        } else {
          setEditing(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // const placeOrder = async () => {
  //   const items = cartWithDetails.map(item => ({
  //     productId: item.id,
  //     quantity: item.qty,
  //     snapName: item.name,
  //     snapPrice: item.newPrice,
  //     snapImage: item.image
  //   }));

  //   await axios.post("https://bighaat-clone.onrender.com/place-order", {
  //     user_id,
  //     email,
  //     items,
  //     totalPrice: total,
  //     address
  //   });

  //   alert("Order placed");
  //   clearCart();
  //   closeCart();
  //   navigate("/orders");
  // };
 if (loading) {
  return <p>Loading address...</p>;
}
  

 return (
  <div className="checkout-container">

    

    {editing || !address ? (
      <div className="checkout-form-card">
        <MyAddress existingAddress={address} />
      </div>
    ) : (
      <div className="checkout-address-card">
        <h2>Delivery Address</h2>
        <div className="address-details">
          <p><strong>Name:</strong> {address.name}</p>

          <p><strong>Phone:</strong> {address.phone}</p>

          <p><strong>Flat:</strong> {address.flat}</p>

          <p><strong>Street:</strong> {address.street}</p>

          <p><strong>City:</strong> {address.city}</p>

          <p><strong>District:</strong> {address.district}</p>

          <p>
            <strong>State & Pincode:</strong> {address.state} - {address.pincode}
          </p>

          {address.landmark && (
            <p><strong>Landmark:</strong> {address.landmark}</p>
          )}
        </div> 

        <div className="checkout-actions">
          <button
            className="edit-btn"
            onClick={() => setEditing(true)}
          >
            Edit Address
          </button>

          <button
            className="placeorder-btn"
           onClick={() => {
            navigate("/payment", { state: { address } });
           
          }}>
            Proceed to Payment
          </button>
        </div>

      </div>
    )}

  </div>
);
}

export default CheckoutAddress;

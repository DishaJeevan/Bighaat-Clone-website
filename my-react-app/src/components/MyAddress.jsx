import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../components/CartContext";

function MyAddress() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);

  const user_id = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");

  const { cartWithDetails, total, clearCart, closeCart } = useContext(CartContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    flat: "",
    street: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
    landmark: ""
  });

  useEffect(() => {
    axios.get(`https://bighaat-clone.onrender.com/get-address/${user_id}`)
      .then(res => {
        if (res.data && res.data.name) {
          setForm(res.data);
          setHasAddress(true);
        } else {
          setIsEditing(true); 
        }
      });
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


 const saveAddress = async () => {
  try {
    await axios.post("https://bighaat-clone.onrender.com/save-address", {
      user_id,
      address: form
    });

    alert("Address saved");

    setHasAddress(true);
    setIsEditing(false);

  } catch (err) {
    console.log(err);
    alert("Error saving address");
  }
};


  const placeOrder = async () => {
    try {
      const items = cartWithDetails.map(item => ({
        productId: item.id,
        quantity: item.qty,
        snapName: item.name,
        snapPrice: item.newPrice,
        snapImage: item.image
      }));

      await axios.post("https://bighaat-clone.onrender.com/place-order", {
        user_id,
        email,
        items,
        totalPrice: total,
         address: form
      });

      alert("Order placed successfully");

      clearCart();
      closeCart();
      navigate("/orders");

    } catch (err) {
      console.log(err);
      alert("Error placing order");
    }
  };


  if (hasAddress && !isEditing) {
    return (
      <div className="address-page">
        <h2>My Address</h2>

        <div className="address-card">
          <h4>{form.name}</h4>
          <p>{form.phone}</p>
          <p>{form.flat}, {form.street}</p>
          <p>{form.city}, {form.district}</p>
          <p>{form.state} - {form.pincode}</p>
          <p>{form.landmark}</p>

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => setIsEditing(true)}>Edit Address</button>
            <button onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="address-page">

      <h2 className="page-title">Add / Edit Address</h2>

      <div className="address-container">

        <div className="form-group">
          <label>Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Mobile Number *</label>
          <div className="phone-input">
            <span>+91</span>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Flat / House No</label>
          <input name="flat" value={form.flat} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Street / Area *</label>
          <input name="street" value={form.street} onChange={handleChange} />
        </div>

        <div className="row">
          <div className="form-group">
            <label>Pincode *</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City *</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>District *</label>
            <input name="district" value={form.district} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>State *</label>
            <input name="state" value={form.state} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Landmark</label>
          <input name="landmark" value={form.landmark} onChange={handleChange} />
        </div>

        <div className="form-actions">
                        <button 
                className="cancel-btn" 
                onClick={() => {
                    if (hasAddress) {
                    setIsEditing(false);
                    } else {
                    navigate("/");
                    }
                }}
                >
                Cancel
                </button>

          <button className="save-btn" onClick={saveAddress}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default MyAddress;

import { useState ,useEffect} from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";

function MyAddress({ existingAddress }) {
  const navigate = useNavigate();
   const location = useLocation();

  const user_id = localStorage.getItem("user_id");

  const addressData = existingAddress || location.state?.address;

  const [form, setForm] = useState(
    addressData || {
      name: "",
      phone: "",
      flat: "",
      street: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
      landmark: ""
    }
  );

  useEffect(() => {
  if (!addressData) {
    axios
      .get(`https://bighaat-clone.onrender.com/get-address/${user_id}`)
      .then(res => {
        if (res.data) {
          setForm(res.data);
        }
      });
  }
}, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    try {
      await axios.post(
        "https://bighaat-clone.onrender.com/save-address",
        {
          user_id,
          address: form
        }
      );

     
      window.dispatchEvent(new Event("address_updated"));

      alert("Address saved");
      navigate("/my-address");

    } catch (err) {
      console.log(err);
      alert("Error saving address");
    }
  };

  return (
  <div className="address-form">
    <h2>Add Address</h2>

    <div className="form-group">
      <label>Name</label>
      <input name="name" value={form.name} onChange={handleChange} />
    </div>

    <div className="form-group">
      <label>Phone</label>
      <input name="phone" value={form.phone} onChange={handleChange} />
    </div>

    <div className="form-group">
      <label>Flat / House No</label>
      <input name="flat" value={form.flat} onChange={handleChange} />
    </div>

    <div className="form-group">
      <label>Street</label>
      <input name="street" value={form.street} onChange={handleChange} />
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>City</label>
        <input name="city" value={form.city} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>District</label>
        <input name="district" value={form.district} onChange={handleChange} />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>State</label>
        <input name="state" value={form.state} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Pincode</label>
        <input name="pincode" value={form.pincode} onChange={handleChange} />
      </div>
    </div>

    <div className="form-group">
      <label>Landmark</label>
      <input name="landmark" value={form.landmark} onChange={handleChange} />
    </div>

    <div className="form-buttons">
      <button className="save-btn" onClick={saveAddress}>
        Save Address
      </button>

      <button
        className="cancel-btn"
        onClick={() => navigate("/my-address")}
      >
        Cancel
      </button>
    </div>
  </div>
);
}

export default MyAddress;

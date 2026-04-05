import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
  name: "",
  phone: "",
  flat: "",
  street: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  landmark: ""
});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://bighaat-clone.onrender.com/users");
        const user = res.data.find(u => u._id === id);
            if (user) {
        setEmail(user.email);
        setAddress({
            name: user.address?.name || "",
            phone: user.address?.phone || "",
            flat: user.address?.flat || "",
            street: user.address?.street || "",
            city: user.address?.city || "",
            district: user.address?.district || "",
            state: user.address?.state || "",
            pincode: user.address?.pincode || "",
            landmark: user.address?.landmark || ""
          });
      }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
      finally {
  setLoading(false);
}
    };
    fetchUser();
  }, [id]);

 const handleAddressChange = (e) => {
  setAddress({ ...address, [e.target.name]: e.target.value });
};

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://bighaat-clone.onrender.com/update-user/${id}`, { email,address });
      alert("User updated successfully");
      navigate("/admin/manage-users");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="product-card-useredit">
      <h2 className="user-edit-card-title">Edit User</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          
        </div>
        <h3>Address</h3>

<div className="address-grid">

  <input className="full-width" name="name" value={address.name || ""} onChange={handleAddressChange} placeholder="Name" />

  <input name="phone" value={address.phone || ""} onChange={handleAddressChange} placeholder="Phone" />

  <input name="pincode" value={address.pincode || ""} onChange={handleAddressChange} placeholder="Pincode" />

  <input className="full-width" name="flat" value={address.flat || ""} onChange={handleAddressChange} placeholder="Flat" />

  <input className="full-width" name="street" value={address.street || ""} onChange={handleAddressChange} placeholder="Street" />

  <input name="city" value={address.city || ""} onChange={handleAddressChange} placeholder="City" />

  <input name="district" value={address.district || ""} onChange={handleAddressChange} placeholder="District" />

  <input name="state" value={address.state || ""} onChange={handleAddressChange} placeholder="State" />

  <input className="full-width" name="landmark" value={address.landmark || ""} onChange={handleAddressChange} placeholder="Landmark" />

</div>
         
        <button type="submit" className="edit-btn-user">Update</button>
      </form>
    </div>
  );
}

export default EditUser;

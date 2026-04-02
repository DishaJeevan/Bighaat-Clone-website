import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditOrder() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");

 
  const userId = id || location.pathname.split("/").pop();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(`https://bighaat-clone.onrender.com/user-orders/${userId}`);
        console.log("Orders fetched:", res.data);
        setOrders(res.data);

        if (res.data.length > 0) {
          setStatus(res.data[0].status);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    if (userId) getOrders();
  }, [userId]);

  const updateOrder = async (e) => {
    e.preventDefault();
    try {
   
      await axios.put(`https://bighaat-clone.onrender.com/update-order/${userId}`, { status });
      alert("Order Updated");
      navigate("/admin/manage-orders");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="product-card-useredit">
      <h2 style={{ marginBottom: "20px" }}>Edit Orders for User: {id}</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Image</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
         {orders.map((o) => (
  o.items && o.items.map((item, index) => (
    <tr key={`${o._id}-${index}`}>
      <td>{o.user_id}</td>
      <td>{o.email}</td>
      <td>
        <img 
          src={item.snapImage || item.image} 
          alt="product" 
          width="50" 
        />
      </td>
      <td>{item.snapName || item.productName}</td>
      <td>{item.quantity}</td>
      <td>₹{item.snapPrice || item.price}</td> 
      <td>{new Date(o.datetime).toLocaleString()}</td>
      <td>{o.status}</td>
    </tr>
  ))
))}
        </tbody>
      </table>

      <div className="update-section" style={{ marginTop: "30px", padding: "20px", background: "#f9f9f9" }}>
        <form onSubmit={updateOrder}>
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>Change Order Status:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "5px", borderRadius: "4px" }}
          >
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button type="submit" style={{ marginLeft: "15px", padding: "6px 20px", cursor: "pointer" }}>
            Update All Orders
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditOrder;

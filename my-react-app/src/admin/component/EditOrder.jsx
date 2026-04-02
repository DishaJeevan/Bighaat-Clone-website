import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(`https://bighaat-clone.onrender.com/user-orders/${id}`);
        console.log("Orders fetched:", res.data);
        setOrders(res.data);

        if (res.data.length > 0) {
          setStatus(res.data[0].status);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    if (id) getOrders();
  }, [id]);

  const updateOrder = async (e) => {
    e.preventDefault();
    try {
      // Note: This updates the status for the USER ID provided
      await axios.put(`https://bighaat-clone.onrender.com/update-order/${id}`, { status });
      alert("Orders Updated successfully!");
      navigate("/admin/manage-orders");
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
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
          {orders.map((o) =>
            o.items && o.items.map((item, index) => (
              <tr key={`${o._id}-${index}`}>
                <td>{o.user_id}</td>
                <td>{o.email}</td>
                <td>
                  <img 
                    src={item.snapImage || item.image || "https://via.placeholder.com/50"} 
                    alt="product" 
                    width="50" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} 
                  />
                </td>
            
                <td>{item.snapName || item.productName || "N/A"}</td>
                <td>{item.quantity}</td>
                {/* FIX: Use snapPrice fallback */}
                <td>₹{item.snapPrice || item.price || 0}</td> 
                <td>{new Date(o.datetime).toLocaleString()}</td>
                <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
              </tr>
            ))
          )}
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

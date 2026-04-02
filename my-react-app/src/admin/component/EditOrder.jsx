import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditOrder(){

const {id}=useParams();
const navigate=useNavigate();

const [orders,setOrders] = useState([]);
const [status,setStatus]=useState("");

useEffect(()=>{
  const getOrders=async()=>{

  const res=await axios.get(`https://bighaat-clone.onrender.com/user-orders/${id}`);
  console.log("Orders fetched:", res.data); 
  setOrders(res.data);

  if(res.data.length > 0){
  setStatus(res.data[0].status);
  }
};
getOrders();
},[id]);

const updateOrder=async(e)=>{
  e.preventDefault();
  try{
    await axios.put(`https://bighaat-clone.onrender.com/update-order/${id}`,{status});
    alert("Order Updated");
    navigate("/admin/manage-orders");
  }catch(err){
    console.log(err);
  }
};

return(
<div className="product-card-useredit">
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
            src={item.snapImage || item.image || 'https://via.placeholder.com/50'} 
            alt="product" 
            width="50" 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} 
          />
        </td>
        <td>{item.snapName || item.productName || "N/A"}</td>
        <td>{item.quantity}</td>
        <td>₹{item.snapPrice || item.price || 0}</td> 
        <td>{new Date(o.datetime).toLocaleString()}</td>
        <td>{o.status}</td>
      </tr>
    ))
  ))}
</tbody>
    </table> 
    <form onSubmit={updateOrder}>
    <label>Status</label>

    <select value={status} onChange={(e)=>setStatus(e.target.value)}>
      <option value="Pending">Pending</option>
      <option value="Processed">Processed</option>
      <option value="Delivered">Delivered</option>
    </select>

    <button type="submit">Update Order</button>

    </form>
</div>
);
}

export default EditOrder;

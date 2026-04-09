import { useState, useEffect } from "react";
import axios from "axios";

function Order() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) return;

  axios
    .get(`https://bighaat-clone.onrender.com/user-orders/${user_id}`)
    .then((res) => {
      setOrders(res.data);
    })
    .catch((err) => console.log(err));
}, []);

  return (
    <>
      <div className="manage-container">
        <h2>My Orders</h2>

        {orders.map((o) => (
          <div className="order-card" key={o._id}>
            
         
            <div className="order-left">
              <img
                src={o.items?.[0]?.snapImage || "https://via.placeholder.com/70"}
                alt="product"
              />
              <div>
                <h4>{o.items?.[0]?.snapName || "No Product"}</h4>
                
              </div>
            </div>

         
            <div className="order-right">
              <p>₹{o.totalPrice}</p>
              <p>{new Date(o.datetime).toLocaleDateString()}</p>

              <p style={{
                  fontWeight: "bold",
                  color:
                    o.status === "Delivered" ? "green" :
                    o.status === "Shipped" ? "blue" :
                    o.status === "Processed" ? "orange" :
                    "gray"
                }}>
            {o.status || "Pending"}
          </p>

              <button
                className="view-btn"
                onClick={() => {
                  setSelectedOrder(o);
                  setShowModal(true);
                }}
              >
                View
              </button>
            </div>

          </div>
        ))}
      </div>

     
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <div className="modal-header">
              <h3>Order Details</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

                    <div className="modal-body">
                    <p style={{ fontWeight: "bold" }}>
                    Order Status: {selectedOrder?.status}
                  </p>
                  
                  <p>
                    Payment Status: {selectedOrder?.paymentStatus}
                  </p>
              {selectedOrder?.items?.map((item, index) => (
                <div className="order-item" key={index}>
                          
                  <img
                    src={item.snapImage || "https://via.placeholder.com/60"}
                    alt="product"
                  />

                  <div className="item-info">
                    <h4>{item.snapName}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.snapPrice}</p>
                  </div>

                  
                </div>
              ))}

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Order;

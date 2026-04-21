import { Link, useLocation } from "react-router-dom";
import AddProduct from "./AddProduct";
import ManageProduct from "./ManageProduct";
import EditProduct from "./EditProduct";
import ManageUsers from "./ManageUsers";
import EditUser from "./EditUser";
import axios from "axios";
import ManageOrder from "./ManageOrder";
import EditOrder from "./EditOrder";
import { useEffect, useState } from "react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";

function AdminDashboard() {

  const location = useLocation();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("https://bighaat-clone.onrender.com/orders");
     
      const latest = res.data
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
        .slice(0, 5);
      setRecentOrders(latest);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };
  fetchDashboardData();
}, []);
  const handleLogout=(e)=>{
    e.preventDefault();
    axios.get("https://bighaat-clone.onrender.com/logout")
    .then(res =>console.log(res))
    .catch(err => console.log(err))
  }

  return (
    <div>
      <div className="nav-container">
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-logo">
            <img src="/images/bighaat-logo.webp" alt="BigHaat Logo" />
            <span className="admin-tag">Admin</span>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      <div className="admin-container">
        <div className="sidebar">
          <Link to="/admin/add-product">Add Product</Link>
          <Link to="/admin/manage-product">Manage Product</Link>
          <Link to="/admin/manage-orders">Manage Order</Link>
          <Link to="/admin/manage-users">Manage Users</Link>
        </div>

      {location.pathname.startsWith("/admin/edit-product") ? (
        <EditProduct />
      ) : location.pathname.startsWith("/admin/edit-user") ? (
        <EditUser />
        ) : location.pathname.startsWith("/admin/edit-order") ? (
        <EditOrder />
        ) : location.pathname.startsWith("/admin/user-orders") ? (
        <EditOrder />
      ) : location.pathname === "/admin/add-product" ? (
        <AddProduct />
      ) : location.pathname === "/admin/manage-product" ? (
        <ManageProduct />
      ) : location.pathname === "/admin/manage-users" ? (
        <ManageUsers />
      ): location.pathname === "/admin/manage-orders" ? (
        <ManageOrder />
      ) : (
       
        <div className="dashboard-main-content">
  <div className="dashboard-header">
    <div className="header-text">
      <h2>Welcome to Admin Dashboard</h2>
      <p>BIGHAAT CLONE</p>
    </div>
  </div>

  <div className="stats-grid">
    <div className="stat-card">
      <div className="stat-icon-box blue-bg">
        <i className="fa-solid fa-box-open"></i>
      </div>
      <div className="stat-details">
        <span className="stat-count">10</span>
        <span className="stat-label">Total Products</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon-box green-bg">
        <i className="fa-solid fa-cart-shopping"></i>
      </div>
      <div className="stat-details">
        <span className="stat-count">21</span>
        <span className="stat-label">Total Orders</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon-box purple-bg">
        <i className="fa-solid fa-users"></i>
      </div>
      <div className="stat-details">
        <span className="stat-count">5</span>
        <span className="stat-label">Registered Users</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon-box orange-bg">
        <i className="fa-solid fa-dollar-sign"></i>
      </div>
      <div className="stat-details">
        <span className="stat-count">$1299.75</span>
        <span className="stat-label">Total Revenue</span>
      </div>
    </div>
  </div>

  <div className="dashboard-lower-section">
    <div className="graph-card">
      <div className="card-header">
        <h4>Revenue Trend </h4>
      </div>
      <div className="mock-graph-container">
        
        <div className="graph-grid-line"></div>
        <div className="graph-grid-line"></div>
        <div className="graph-grid-line"></div>
        <div className="graph-curve-svg">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none">
            <path 
              d="M0,130 C50,120 100,140 150,135 C200,130 250,20 300,50 C350,80 400,110 450,105 L500,100" 
              fill="none" 
              stroke="#009640" 
              strokeWidth="3"
            />
            <path 
              d="M0,130 C50,120 100,140 150,135 C200,130 250,20 300,50 C350,80 400,110 450,105 L500,100 L500,150 L0,150 Z" 
              fill="url(#greenGradient)" 
            />
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor:'#009640', stopOpacity:0.2}} />
                <stop offset="100%" style={{stopColor:'#009640', stopOpacity:0}} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>

    <div className="orders-card">
      <div className="orders-card-header">
        <h3>Recent Orders</h3>
        <Link to="/admin/manage-orders" className="view-all-link">View All</Link>
      </div>
      <div className="table-responsive">
        <table className="dashboard-mini-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
  {recentOrders.map((order) => (
    <tr key={order._id}>
  
      <td style={{ cursor: 'pointer', color: '#009640' }} 
          onClick={() => navigate(`/admin/user-orders/${order.user_id}`, { state: { orderId: order._id } })}>
        #{order._id.slice(-6).toUpperCase()}
      </td>
      <td>{new Date(order.datetime).toLocaleDateString()}</td>
      <td>₹{order.totalPrice}</td>
      <td>
        <span className={`status-tag ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  </div>
</div>
      )}
    </div>
    </div>  
  );
}

export default AdminDashboard;

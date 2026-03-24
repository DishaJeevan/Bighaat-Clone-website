import { Link, useLocation } from "react-router-dom";
import AddProduct from "./AddProduct";
import ManageProduct from "./ManageProduct";
import EditProduct from "./EditProduct";
import ManageUsers from "./ManageUsers";
import EditUser from "./EditUser";
import axios from "axios";
import ManageOrder from "./ManageOrder";
import EditOrder from "./EditOrder";

function AdminDashboard() {

  const location = useLocation();
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
          <Link to="/" className="admin-logo">
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
        <div className="welcome-dashboard-card">
          <h2>Welcome to Admin Dashboard</h2>
        </div>
      )}
    </div>
    </div>  
  );
}

export default AdminDashboard;
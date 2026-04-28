import { Link, useLocation, useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import ManageProduct from "./ManageProduct";
import EditProduct from "./EditProduct";
import ManageUsers from "./ManageUsers";
import EditUser from "./EditUser";
import axios from "axios";
import ManageOrder from "./ManageOrder";
import EditOrder from "./EditOrder";
import ManageContact from "./ManageContact";
import { useEffect, useState } from "react"; 
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer, AreaChart, Area, BarChart, Bar} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";


function AdminDashboard() {

  const location = useLocation();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const COLORS = ["#28a745", "#ffc107", "#007bff", "#dc3545"];


  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const ordersRes = await axios.get("https://bighaat-clone.onrender.com/orders");
      const productsRes = await axios.get("https://bighaat-clone.onrender.com/products");
      const usersRes = await axios.get("https://bighaat-clone.onrender.com/users");

      const orders = ordersRes.data;

      setTotalOrders(orders.length);
      setTotalProducts(productsRes.data.length);
      setTotalUsers(usersRes.data.length);

      const revenue = orders
        .filter(order =>
          order.paymentStatus === "Paid" ||
          (order.paymentMethod === "COD" && order.status === "Delivered")
        )
        .reduce((sum, order) => sum + order.totalPrice, 0);

      setTotalRevenue(revenue);

      
      const latest = [...orders]
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
        .slice(0, 5);

      setRecentOrders(latest);

    
      const grouped = {};
      orders.forEach(order => {
        const date = new Date(order.datetime).toLocaleDateString();

        if (
          order.paymentStatus === "Paid" ||
          (order.paymentMethod === "COD" && order.status === "Delivered")
        ) {
          if (!grouped[date]) grouped[date] = 0;
          grouped[date] += order.totalPrice;
        }
      });

      setRevenueData(
        Object.keys(grouped).map(date => ({
          date,
          revenue: grouped[date]
        }))
      );

      const statusCount = {};
      orders.forEach(order => {
        const status = order.status || "Unknown";
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      setOrderStatusData(
        Object.keys(statusCount).map(status => ({
          name: status,
          value: statusCount[status]
        }))
      );

      
     const productSales = {};

orders.forEach(order => {
  order.items?.forEach(item => {
    const name = item.snapName || item.productName;

    if (!name) return;

    if (!productSales[name]) {
      productSales[name] = 0;
    }

    productSales[name] += item.quantity || 1;
  });
});

const topProducts = Object.entries(productSales)
  .map(([name, qty]) => ({ name, quantity: qty }))
  .sort((a, b) => b.quantity - a.quantity)
  .slice(0, 5);

console.log("Top Products:", topProducts); 

setBarData(topProducts);



      const ordersTrend = {};
      orders.forEach(order => {
        const date = new Date(order.datetime).toLocaleDateString();
        ordersTrend[date] = (ordersTrend[date] || 0) + 1;
      });

      setAreaData(
        Object.keys(ordersTrend)
        .sort((a, b) => new Date(a) - new Date(b))
        .map(date => ({
          date,
          orders: ordersTrend[date]
        }))
      );

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  fetchDashboardData();
}, []);
  
  const handleLogout = async () => {
  try {
    await axios.get("https://bighaat-clone.onrender.com/logout");
    navigate("/");
  } catch (err) {
    console.log(err);
    navigate("/");
  }
};

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
          <Link to="/admin/manage-contact">ContactForm</Link>
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
    ) : location.pathname === "/admin/manage-contact" ? (
  <ManageContact />
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
      <span className="stat-count">{totalProducts}</span>
        <span className="stat-label">Total Products</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon-box green-bg">
        <i className="fa-solid fa-cart-shopping"></i>
      </div>
      <div className="stat-details">
       <span className="stat-count">{totalOrders}</span>

        <span className="stat-label">Total Orders</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon-box purple-bg">
        <i className="fa-solid fa-users"></i>
      </div>
      <div className="stat-details">
      <span className="stat-count">{totalUsers}</span>
        <span className="stat-label">Registered Users</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon-box orange-bg">
        <i className="fa-solid fa-dollar-sign"></i>
      </div>
      <div className="stat-details">
        <span className="stat-count">{totalRevenue}</span>
        <span className="stat-label">Total Revenue</span>
      </div>
    </div>
  </div>

  <div className="dashboard-lower-section">
  <div className="graph-card">
    <div className="card-header">
      <h4>Revenue Trend</h4>
    </div>

    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#009640" />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="graph-card">
    <div className="card-header">
      <h4>Order Status</h4>
    </div>

    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={orderStatusData} dataKey="value" nameKey="name" outerRadius={80} label>
          {orderStatusData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
   <div className="graph-card">
    <div className="card-header">
      <h4>Top Products</h4>
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantity" fill="#007bff" />
      </BarChart>
    </ResponsiveContainer>
  </div>
    <div className="graph-card">
    <div className="card-header">
      <h4>Orders Trend</h4>
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={areaData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="orders" stroke="#28a745" fill="#28a745" />
      </AreaChart>
    </ResponsiveContainer>
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
              
                  <td onClick={() => navigate(`/admin/user-orders/${order.user_id}`, { state: { orderId: order._id } })} style={{ cursor: "pointer", color: "#009640" }}>
                    {order._id.slice(-6).toUpperCase()}
                  </td>
                  <td>{new Date(order.datetime).toLocaleDateString()}</td>
  
                  <td>₹{order.totalPrice}</td>
            
                  <td>
                    <span className={`status-tag ${order.status?.toLowerCase()}`}>
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
      )}
    </div>
  </div> 
  );
}

export default AdminDashboard;

import { Routes, Route } from "react-router-dom";
import AdminLogin from "./component/AdminLogin";
import AdminDashboard from "./component/AdminDashboard";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="add-product" element={<AdminDashboard />} />
      <Route path="manage-product" element={<AdminDashboard />} />
      <Route path="edit-product/:id" element={<AdminDashboard />} />
      <Route path="manage-users" element={<AdminDashboard />} />
      <Route path="edit-user/:id" element={<AdminDashboard />} />
      <Route path="manage-orders" element={<AdminDashboard />} />
      <Route path="edit-order/:id" element={<AdminDashboard />} />
      <Route path="user-orders/:id" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AdminRoutes;
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminRoutes from "./admin/AdminRoutes";

import { CartProvider } from "./components/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <Routes>
         <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </CartProvider>
  </BrowserRouter>
);
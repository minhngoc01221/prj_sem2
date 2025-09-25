// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutUs from "./pages/AboutUsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import ReviewsPage from "./pages/ReviewPage";
import MyOrderPage from "./pages/MyOrderPage"; // ✅ Đổi thành MyOrderPage

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context
import { CartProvider } from "./context/CartContext";

// ✅ Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("role");
  if (!role || (allowedRoles && !allowedRoles.includes(role))) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [role, setRole] = useState(() => localStorage.getItem("role") || "guest");

  useEffect(() => {
    if (role && role !== "guest") {
      localStorage.setItem("role", role);
    }
  }, [role]);

  const handleLogout = () => {
    setRole("guest");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
  };

  return (
    <CartProvider>
      <Router>
        <div className="app-shell">
          <Navbar role={role} onLogout={handleLogout} />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />

              {/* ✅ Auth */}
              <Route path="/login" element={<LoginPage setRole={setRole} />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ✅ Trang MyOrder chỉ cho phép user đã login */}
              <Route
                path="/myorder"
                element={
                  <ProtectedRoute allowedRoles={["Customer", "Admin", "Owner"]}>
                    <MyOrderPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

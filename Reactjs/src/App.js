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

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context
import { CartProvider } from "./context/CartContext";

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL || "http://localhost:3001";

function App() {
  const [role, setRole] = useState(() => localStorage.getItem("role") || "guest");

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  const handleLogout = () => {
    setRole("guest");
    localStorage.removeItem("role");
    localStorage.removeItem("cart"); // 👈 clear cart khi logout
  };

  return (
    <CartProvider>
      <Router>
        <div className="app-shell">
          <Navbar adminUrl={ADMIN_URL} role={role} onLogout={handleLogout} />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />

              <Route path="/login" element={<LoginPage setRole={setRole} />} />
              <Route path="/register" element={<RegisterPage />} />
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

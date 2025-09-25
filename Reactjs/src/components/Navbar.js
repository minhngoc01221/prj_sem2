import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import "../css/Navbar.css";
import { CartContext } from "../context/CartContext";

const Navbar = ({ role = "guest", onLogout }) => {
  const isLoggedIn = role !== "guest";
  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/" className="logo-link">
          <span className="logo-highlight">DMN</span> Store
        </Link>
      </div>

      {/* Menu */}
      <nav>
        <ul>
          <li>
            <NavLink to="/" end className="nav-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className="nav-link">
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link">
              About Us
            </NavLink>
          </li>

          {isLoggedIn && (
            <>
              {/* Giữ nguyên Cart */}
              <li className="cart-link-wrapper">
                <NavLink to="/cart" className="nav-link">
                  Cart
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </NavLink>
              </li>

              {/* Giữ nguyên Review */}
              <li>
                <NavLink to="/reviews" className="nav-link">
                  Review
                </NavLink>
              </li>

              {/* ✅ MyOrder với logo SVG */}
              <li>
                <NavLink to="/myorder" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {/* Icon hộp hàng */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 16V8a1 1 0 0 0-.553-.894l-8-4a1 1 0 0 0-.894 0l-8 4A1 1 0 0 0 3 8v8a1 1 0 0 0 .553.894l8 4a1 1 0 0 0 .894 0l8-4A1 1 0 0 0 21 16ZM12 4.236 18.764 8 12 11.764 5.236 8ZM5 9.618l6 3.428V19l-6-3.428Zm8 9.382v-5.954l6-3.428V16Z" />
                  </svg>
                  <span>My Orders</span>
                </NavLink>
              </li>
            </>
          )}

          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login" className="auth-link login">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="auth-link register">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/" onClick={onLogout} className="btn-logout">
                Logout
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

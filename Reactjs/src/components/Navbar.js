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
              <li className="cart-link-wrapper">
                <NavLink to="/cart" className="nav-link">
                  Cart
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/reviews" className="nav-link">
                  Review
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

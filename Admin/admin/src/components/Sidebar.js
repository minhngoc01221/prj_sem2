import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

export default function Sidebar() {
  const handleLogout = () => {
    // Xoá thông tin login (nếu có)
    localStorage.removeItem("role");
    // Điều hướng về trang React (site khách) ở port 3000
    window.location.href = "http://localhost:3000/";
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo-circle">DMN</div>
        <div>
          <h3>DMN STORE  ADMIN</h3>
        </div>
      </div>

      <nav className="menu">
        <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
          📊 Reports
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          📋 Dashboard
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
          📦 Products
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
          🧾 Orders
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
          👤 Admin
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
          ⚙️ Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Log out
        </button>
      </div>
    </aside>
  );
}

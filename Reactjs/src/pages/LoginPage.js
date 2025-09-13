import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/AuthPage.css";

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL || "http://localhost:3001";

const LoginPage = ({ setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [role, setRoleSelect] = useState("customer");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "admin") {
      window.location.href = ADMIN_URL;
      return;
    }

    // customer login
    setRole("customer");
    if (remember) localStorage.setItem("role", "customer");
    navigate("/");
  };

  return (
    <div className="register-page">
      {/* Cột trái: ảnh nền */}
      <div
        className="register-hero"
        style={{
          backgroundImage: "url(/image/LoginPage.jpeg)", // bạn thêm ảnh Login.jpg vào public/image
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="register-hero-overlay" />
      </div>

      {/* Cột phải: form */}
      <div className="register-panel">
        <div className="register-panel-inner">
          <h2 className="register-title">LOGIN</h2>

          <form onSubmit={handleLogin} className="auth-form register-form">
            <label className="auth-label">Email</label>
            <input
              className="line-input"
              type="email"
              placeholder="Email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="auth-label">Password</label>
            <input
              className="line-input"
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="aux-row">
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
            </div>

            <div className="role-row">
              <span className="role-label">Login as:</span>
              <select
                value={role}
                onChange={(e) => setRoleSelect(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="register-actions">
              <button type="submit" className="btn-register">
                Sign In
              </button>
              <Link to="/register" className="signin-link">
                Register →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

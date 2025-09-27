import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/AuthPage.css";

const API_URL = "http://localhost:8000/api/login";

const LoginPage = ({ setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Login failed");
    }

    const data = await res.json();

    // ✅ Gộp thông tin user thành object và lưu
    const userData = {
      id: data.id,
      name: data.name,
      role: data.role,
    };
    localStorage.setItem("user", JSON.stringify(userData));

    // ✅ Nếu có token từ API thì lưu luôn
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (remember) {
      localStorage.setItem("remember", "true");
    }

    // ✅ Cập nhật role trong state App.js
    setRole(data.role);

    // ✅ Điều hướng theo role
    if (data.role === "Owner" || data.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError(err.message);
  }
};


  return (
    <div className="register-page">
      <div
        className="register-hero"
        style={{
          backgroundImage: "url(/image/LoginPage.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="register-hero-overlay" />
      </div>

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

            {error && <p className="error-text">{error}</p>}

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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/AuthPage.css";

const API_URL = "http://localhost:8000/api/register";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // có thể bỏ nếu không dùng trong DB
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email,
          password: password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Register failed");
      }

      const data = await res.json();
      console.log("Register success:", data);

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      {/* Cột trái: ảnh nền */}
      <div
        className="register-hero"
        style={{
          backgroundImage: "url(/image/Register.jpg)",
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
          <h2 className="register-title">REGISTER</h2>

          <form onSubmit={handleSubmit} className="auth-form register-form">
            <label className="auth-label">Full Name</label>
            <input
              className="line-input"
              type="text"
              placeholder="Name..."
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <label className="auth-label">Email</label>
            <input
              className="line-input"
              type="email"
              placeholder="Email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Nếu bạn không lưu username trong DB có thể bỏ hẳn */}
            <label className="auth-label">Username</label>
            <input
              className="line-input"
              type="text"
              placeholder="Username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

            <label className="auth-label">Repeat Password</label>
            <input
              className="line-input"
              type="password"
              placeholder="************"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />

            <label className="agree-row">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <span>
                I agree to the <a href="#terms">Terms of Use</a>
              </span>
            </label>

            {error && <p className="error-text">{error}</p>}

            <div className="register-actions">
              <button type="submit" className="btn-register">Sign Up</button>
              <Link to="/login" className="signin-link">Sign in →</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

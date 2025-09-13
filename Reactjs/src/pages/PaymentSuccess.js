// src/pages/PaymentSuccess.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-success">
      <div className="success-icon">✔</div>
      <h2 className="success-text">Payment Successful!</h2>
      <p>Your payment has been completed.</p>
      <button className="btn-back" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;

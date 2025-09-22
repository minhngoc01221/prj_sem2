import React, { useState } from "react";
import axios from "axios";
import styles from "./PaymentSettings.module.css";

const PaymentSettings = () => {
  const [form, setForm] = useState({
    method: "paypal",
    api_key: "",
    secret: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.api_key || !form.secret) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/settings/payment", form);
      setSuccess("Payment settings saved successfully!");
    } catch (err) {
      setError("Failed to save payment settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Payment Settings</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Payment Method</label>
          <select
            className={styles.input}
            name="method"
            value={form.method}
            onChange={handleChange}
          >
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>API Key</label>
          <input
            className={styles.input}
            name="api_key"
            placeholder="Enter your API key"
            value={form.api_key}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Secret Key</label>
          <input
            className={styles.input}
            name="secret"
            placeholder="Enter your secret key"
            value={form.secret}
            onChange={handleChange}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <button className={styles.saveBtn} type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default PaymentSettings;

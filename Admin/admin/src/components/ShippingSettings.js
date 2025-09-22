import React, { useState } from "react";
import axios from "axios";
import styles from "./ShippingSettings.module.css";

const ShippingSettings = () => {
  const [form, setForm] = useState({
    provider: "ghn",
    cost: "",
    free_shipping_over: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.cost || !form.free_shipping_over) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/settings/shipping", form);
      setSuccess("Shipping settings saved successfully!");
    } catch (err) {
      setError("Failed to save shipping settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Shipping Settings</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Shipping Provider</label>
          <select
            className={styles.input}
            name="provider"
            value={form.provider}
            onChange={handleChange}
          >
            <option value="ghn">GHN</option>
            <option value="ghtk">GHTK</option>
            <option value="vnpost">VNPost</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Shipping Cost (₫)</label>
          <input
            className={styles.input}
            type="number"
            name="cost"
            placeholder="e.g., 30000"
            value={form.cost}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Free Shipping Over (₫)</label>
          <input
            className={styles.input}
            type="number"
            name="free_shipping_over"
            placeholder="e.g., 500000"
            value={form.free_shipping_over}
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

export default ShippingSettings;

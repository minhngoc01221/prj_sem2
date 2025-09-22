import React, { useState } from "react";
import axios from "axios";
import styles from "./EmailSettings.module.css";

const EmailSettings = () => {
  const [form, setForm] = useState({
    smtp_host: "",
    smtp_port: "",
    smtp_user: "",
    smtp_pass: "",
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

    if (!form.smtp_host || !form.smtp_port || !form.smtp_user || !form.smtp_pass) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/settings/email", form);
      setSuccess("Email settings saved successfully!");
    } catch (err) {
      setError("Failed to save email settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.emailForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Email Settings</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>SMTP Host</label>
          <input
            className={styles.input}
            type="text"
            name="smtp_host"
            placeholder="e.g., smtp.gmail.com"
            value={form.smtp_host}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>SMTP Port</label>
          <input
            className={styles.input}
            type="text"
            name="smtp_port"
            placeholder="e.g., 587"
            value={form.smtp_port}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>SMTP User</label>
          <input
            className={styles.input}
            type="email"
            name="smtp_user"
            placeholder="e.g., your@email.com"
            value={form.smtp_user}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>SMTP Password</label>
          <input
            className={styles.input}
            type="password"
            name="smtp_pass"
            placeholder="Password"
            value={form.smtp_pass}
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

export default EmailSettings;

import React, { useState } from "react";
import axios from "axios";
import styles from "./GeneralSettings.module.css";

const GeneralSettings = () => {
  const [form, setForm] = useState({
    company_name: "",
    logo: null,
    address: "",
    timezone: "Viet Nam",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.company_name || !form.address || !form.timezone) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("company_name", form.company_name);
      data.append("logo", form.logo);
      data.append("address", form.address);
      data.append("timezone", form.timezone);

      await axios.post("http://localhost:8000/api/settings/general", data);
      setSuccess("General settings saved!");
    } catch (err) {
      setError("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>General Settings</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Company Name</label>
          <input
            className={styles.input}
            name="company_name"
            type="text"
            placeholder="e.g., DMN Store"
            value={form.company_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Logo</label>
          <input
            className={styles.input}
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Address</label>
          <input
            className={styles.input}
            name="address"
            type="text"
            placeholder="e.g., 123 Lê Lợi, Hà Nội"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Timezone</label>
          <select
            className={styles.input}
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
          >
            <option value="Viet Nam">Viet Nam</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Bangkok">Asia/Bangkok</option>
          </select>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <button className={styles.saveBtn} type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default GeneralSettings;

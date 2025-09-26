import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./GeneralSettings.module.css";

const GeneralSettings = () => {
  const [form, setForm] = useState({
    company_name: "",
    logo: null,
    address: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Load dữ liệu ban đầu
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/settings/general");
        const data = res.data;
        setForm({
          company_name: data.company_name || "",
          logo: null,
          address: data.address || "",
        });
        setLogoPreview(data.logo || null);
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
    setError("");
    setSuccess("");
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData();

      // luôn gửi các field, ngay cả khi rỗng
      data.append("company_name", form.company_name || "");
      data.append("address", form.address || "");
      if (form.logo) {
        data.append("logo", form.logo);
      }

      const res = await axios.post("http://localhost:8000/api/settings/general", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(res.data.message || "General settings saved!");
      setError("");
    } catch (err) {
      console.error("Save error:", err.response ? err.response.data : err);
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
          {logoPreview && (
            <div className={styles.logoPreview}>
              <img src={logoPreview} alt="Logo Preview" height="80" />
            </div>
          )}
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

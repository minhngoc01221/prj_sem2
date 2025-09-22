import React, { useState } from "react";
import axios from "axios";
import styles from "./RolesPermissions.module.css";

const RolesPermissions = () => {
  const [form, setForm] = useState({
    role: "user",
    permissions: [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const togglePermission = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/settings/roles", form);
      setSuccess("Roles & permissions saved successfully!");
    } catch (err) {
      setError("Failed to save roles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <h2 className={styles.title}>Roles & Permissions</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Select Role</label>
          <select
            className={styles.input}
            name="role"
            value={form.role}
            onChange={(e) => {
              setForm({ ...form, role: e.target.value });
              setError("");
              setSuccess("");
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className={styles.permissions}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.permissions.includes("view_products")}
              onChange={() => togglePermission("view_products")}
            />
            View Products
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.permissions.includes("edit_products")}
              onChange={() => togglePermission("edit_products")}
            />
            Edit Products
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.permissions.includes("manage_users")}
              onChange={() => togglePermission("manage_users")}
            />
            Manage Users
          </label>
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

export default RolesPermissions;

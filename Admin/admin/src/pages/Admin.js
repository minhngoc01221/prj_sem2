import React, { useEffect, useState } from "react";
import styles from "../styles/admin.module.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users");
        const data = await res.json();
        setUsers(data.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(
        `http://localhost:8000/api/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: selectedUser.role,
            status: selectedUser.status,
          }),
        }
      );
      if (!res.ok) throw new Error("Update failed");

      const res2 = await fetch("http://localhost:8000/api/users");
      const data2 = await res2.json();
      setUsers(data2.data || []);
      setEditMode(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  return (
    <div className={styles.adminUsers}>
      <h2>Admin Users</h2>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All roles</option>
          <option value="Owner">Owner</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
          <option value="Customer">Customer</option>
        </select>
        <button onClick={() => setRoleFilter("")}>Clear</button>
      </div>

      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <span
                  className={`${styles.badge} ${
                    u.status === "Active" ? styles.active : styles.inactive
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setEditMode(false);
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setEditMode(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {!editMode ? (
              <>
                <h3>Thông tin người dùng</h3>
                <p><b>Tên:</b> {selectedUser.name}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Role:</b> {selectedUser.role}</p>
                <p><b>Status:</b> {selectedUser.status}</p>
                <button onClick={() => setSelectedUser(null)}>Close</button>
              </>
            ) : (
              <>
                <h3>Edit User</h3>
                <label>Role:</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Customer">Customer</option>
                </select>
                <label>Status:</label>
                <select
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setSelectedUser(null)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

import React from 'react';
import '../styles/page.css';

export default function Settings(){
  return (
    <div className="page-wrapper">
      <h2 className="page-title">Settings</h2>
      <div className="card settings-card">
        <div className="form-row">
          <label>Site name</label>
          <input defaultValue="My Company" />
        </div>
        <div className="form-row">
          <label>Admin email</label>
          <input defaultValue="admin@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" defaultValue="password123" />
        </div>
        <div className="form-actions">
          <button className="btn">Cancel</button>
          <button className="btn primary">Save changes</button>
        </div>
      </div>
    </div>
  );
}

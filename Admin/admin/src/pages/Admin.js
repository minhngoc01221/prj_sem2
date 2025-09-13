import React from 'react';
import '../styles/page.css';

export default function Admin(){
  const users = new Array(6).fill(0).map((_,i)=>({
    id: i+1,
    name: 'User ' + (i+1),
    email: 'user'+(i+1)+'@example.com',
    role: i===0 ? 'Owner' : 'Staff',
    status: i%2===0 ? 'Active' : 'Inactive'
  }));
  return (
    <div className="page-wrapper">
      <h2 className="page-title">Admin Users</h2>
      <div className="filter-bar">
        <input placeholder="Search users..." />
        <select><option>All roles</option></select>
        <button className="btn">Clear</button>
        <button className="btn primary">Add User</button>
      </div>

      <div className="table card-table">
        <div className="table-row header">
          <div className="cell">#</div>
          <div className="cell">Name</div>
          <div className="cell">Email</div>
          <div className="cell">Role</div>
          <div className="cell">Status</div>
          <div className="cell">Actions</div>
        </div>
        {users.map(u=>(
          <div className="table-row" key={u.id}>
            <div className="cell">{u.id}</div>
            <div className="cell">{u.name}</div>
            <div className="cell">{u.email}</div>
            <div className="cell">{u.role}</div>
            <div className="cell">
              <span className={u.status==='Active' ? 'badge active' : 'badge inactive'}>{u.status}</span>
            </div>
            <div className="cell">
              <button className="btn small">View</button>
              <button className="btn small warning">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import '../styles/header.css';

export default function Header(){
  return (
    <header className="app-header">
      <div className="search-area">
        <input placeholder="Search..." />
      </div>
      <div className="header-actions">
        <div className="user">Xin chào, Admin</div>
      </div>
    </header>
  );
}

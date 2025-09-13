import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Reports from './pages/Reports';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import './styles/app.css';

export default function App(){
  return (
    <Router>
      <div className="app-root">
        <Sidebar />
        <div className="main-area">
          <Header />
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Navigate to="/reports" replace />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

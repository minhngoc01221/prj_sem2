import React from 'react';
import '../styles/page.css';

export default function Reports(){
  return (
    <div className="page-wrapper">
      <h2 className="page-title">Reports</h2>
      <div className="cards-grid">
        <div className="card">
          <small>Total Revenue</small>
          <div className="card-value">0$</div>
        </div>
        <div className="card">
          <small>Orders</small>
          <div className="card-value">0$</div>
        </div>
        <div className="card">
          <small>Avg Order</small>
          <div className="card-value">0$</div>
        </div>
        <div className="card">
          <small>New Customers</small>
          <div className="card-value">0$</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-large">[Line chart placeholder]</div>
        <div className="chart-small">[Pie chart placeholder]</div>
      </div>
    </div>
  );
}

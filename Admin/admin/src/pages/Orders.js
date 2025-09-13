import React from 'react';
import '../styles/page.css';

export default function Orders(){
  const orders = new Array(8).fill(0).map((_,i)=>({
    id: '#'+(500+i),
    customer: 'Customer '+(i+1),
    date: '02/09/2025',
    payment: i%2===0 ? 'Paid' : 'Pending',
    status: i%3===0 ? 'Fulfilled' : 'Processing',
    total: '$'+(50+i*10)
  }));
  return (
    <div className="page-wrapper">
      <h2 className="page-title">Orders</h2>
      <div className="filter-bar">
        <input placeholder="Search orders..." />
        <select><option>All statuses</option></select>
        <input type="date" />
        <button className="btn">Clear</button>
        <button className="btn primary">Bulk Action</button>
      </div>

      <div className="table card-table">
        <div className="table-row header">
          <div className="cell">Order ID</div>
          <div className="cell">Customer</div>
          <div className="cell">Date</div>
          <div className="cell">Payment</div>
          <div className="cell">Status</div>
          <div className="cell">Total</div>
          <div className="cell">Actions</div>
        </div>
        {orders.map((o,idx)=>(
          <div className="table-row" key={o.id}>
            <div className="cell">{o.id}</div>
            <div className="cell">{o.customer}</div>
            <div className="cell">{o.date}</div>
            <div className="cell">{o.payment}</div>
            <div className="cell">{o.status}</div>
            <div className="cell">{o.total}</div>
            <div className="cell">
              <button className="btn small primary">View</button>
              <button className="btn small warning">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";


function DashboardPage() {
  const [stats, setStats] = useState({
    conversion: 0,
    revenue: 0,
    orders: 0,
    customers: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Gọi API backend để lấy dữ liệu dashboard
    axios.get("http://localhost:8000/api/dashboard")
      .then(res => {
        setStats(res.data.stats);
        setSalesData(res.data.sales);
        setTopProducts(res.data.topProducts);
        setRecentOrders(res.data.recentOrders);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard-container">
      {/* Thống kê nhanh */}
      <div className="stats-cards">
        <div className="card">Conversion <br /> {stats.conversion}%</div>
        <div className="card">Total Revenue <br /> ${stats.revenue}</div>
        <div className="card">Orders <br /> {stats.orders}</div>
        <div className="card">Customers <br /> {stats.customers}</div>
      </div>

      {/* Sales Overview (biểu đồ) */}
      <div className="chart-section">
        <h3>Sales Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="top-products">
        <h3>Top Products</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Revenue</th>
              <th>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p, idx) => (
              <tr key={idx}>
                <td>{p.name}</td>
                <td>${p.revenue}</td>
                <td><img src={p.thumbnail} alt={p.name} width="50" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o, idx) => (
              <tr key={idx}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.date}</td>
                <td>${o.amount}</td>
                <td>{o.status}</td>
                <td><button>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardPage;

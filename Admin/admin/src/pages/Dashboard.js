import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm fetch dữ liệu
  const fetchStats = () => {
    fetch("http://localhost:8000/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats(); // gọi lần đầu

    // Tự động refresh mỗi 15 giây
    const interval = setInterval(fetchStats, 15000);

    // Dọn dẹp khi component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!stats) return <p>Lỗi khi tải dữ liệu</p>;

  const chartData = {
    labels: stats.topProducts.map((p) => p.name),
    datasets: [
      {
        label: "Revenue",
        data: stats.topProducts.map((p) => p.revenue),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card revenue">
          <h4>Total Revenue</h4>
          <p>${Number(stats.totalRevenue).toFixed(2)}</p>
        </div>
        <div className="card orders">
          <h4>Orders</h4>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="card customers">
          <h4>Customers</h4>
          <p>{stats.totalCustomers}</p>
        </div>
      </div>

      <div className="chart-section">
        <h3 className="chart-title">Top Products</h3>
        <Bar data={chartData} />
      </div>

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
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.user?.name || "Guest"}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>${Number(o.total).toFixed(2)}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

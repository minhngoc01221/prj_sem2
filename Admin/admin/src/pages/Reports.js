import React, { useEffect, useState } from "react";
import styles from "./ReportsPage.module.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    newCustomers: 0,
    revenueByDate: [],
    ordersByDate: [],
    recentOrders: []
  });

  const [refreshing, setRefreshing] = useState(false);

  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const fetchData = async () => {
    try {
      if (stats.totalOrders > 0) setRefreshing(true); // Hiện overlay refresh
      const res = await fetch("http://127.0.0.1:8000/api/reports");
      const data = await res.json();
      setStats({
        totalRevenue: parseFloat(data.totalRevenue ?? 0),
        totalOrders: data.totalOrders ?? 0,
        avgOrderValue: parseFloat(data.avgOrderValue ?? 0),
        newCustomers: data.newCustomers ?? 0,
        revenueByDate: data.revenueByDate ?? [],
        ordersByDate: data.ordersByDate ?? [],
        recentOrders: data.recentOrders ?? []
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 🔥 Lắng nghe sự kiện từ Orders.jsx để reload ngay khi có update
    const reloadListener = () => fetchData();
    window.addEventListener("ordersUpdated", reloadListener);

    return () => window.removeEventListener("ordersUpdated", reloadListener);
  }, []);

  return (
    <div className={`${styles.container} ${refreshing ? styles.refreshing : ""}`}>
      {/* 4 thẻ thống kê */}
      <div className={styles.statsGrid}>
        <div className={styles.card}><h2>Doanh thu hôm nay</h2><p>{formatUSD(stats.totalRevenue)}</p></div>
        <div className={styles.card}><h2>Đơn hàng hôm nay</h2><p>{stats.totalOrders}</p></div>
        <div className={styles.card}><h2>Giá trị đơn TB</h2><p>{formatUSD(stats.avgOrderValue)}</p></div>
        <div className={styles.card}><h2>Khách hàng mới</h2><p>{stats.newCustomers}</p></div>
      </div>

      {/* Biểu đồ */}
      <div className={styles.chartGrid}>
        <div className={styles.chartWrapper}>
          <h2>Doanh thu theo ngày</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatUSD(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartWrapper}>
          <h2>Số đơn hàng theo ngày</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.ordersByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bảng đơn hàng gần đây */}
      <div className={styles.tableWrapper}>
        <h2>Đơn hàng hôm nay</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td className={styles.amount}>{formatUSD(order.total)}</td>
                <td>
                  <span className={
                    order.status === "Fulfilled" ? styles.statusFulfilled :
                    order.status === "Processing" ? styles.statusProcessing : styles.statusCancelled
                  }>
                    <span className={styles.statusDot}></span>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bảng tóm tắt 5 cột */}
      <div className={styles.summaryTableWrapper}>
        <table className={styles.summaryTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>AVG Order Value</th>
              <th>Customers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{new Date().toLocaleDateString()}</td>
              <td>{stats.totalOrders}</td>
              <td>{formatUSD(stats.totalRevenue)}</td>
              <td>{formatUSD(stats.avgOrderValue)}</td>
              <td>{stats.newCustomers}</td>
            </tr>
          </tbody>
        </table>
        <button className={styles.exportBtn}>Export</button>
      </div>

      {refreshing && <div className={styles.refreshOverlay}>🔄 Đang cập nhật...</div>}
    </div>
  );
}

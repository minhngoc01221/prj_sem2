import React, { useEffect, useState, useCallback } from "react";
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
  const [range, setRange] = useState("daily");

  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`http://127.0.0.1:8000/api/reports?range=${range}`);
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
  }, [range]);

  useEffect(() => {
    fetchData();

    const reloadListener = () => fetchData();
    window.addEventListener("ordersUpdated", reloadListener);
    return () => window.removeEventListener("ordersUpdated", reloadListener);
  }, [fetchData]);

  // ✅ Hàm lọc top 5
  const getTopData = (data, key = "revenue") => {
    if (range === "weekly" || range === "monthly") {
      return [...data]
        .sort((a, b) => b[key] - a[key]) // sort giảm dần theo doanh thu / orders
        .slice(0, 5)                     // lấy top 5
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // sắp lại theo ngày
    }
    return data;
  };

  return (
    <div className={`${styles.container} ${refreshing ? styles.refreshing : ""}`}>
      {/* Bộ chọn range */}
      <div className={styles.rangeSelector}>
        {["daily", "weekly", "monthly"].map((r) => (
          <button
            key={r}
            className={range === r ? styles.activeBtn : ""}
            onClick={() => setRange(r)}
          >
            {r === "daily" ? "Ngày" : r === "weekly" ? "Tuần" : "Tháng"}
          </button>
        ))}
      </div>

      {/* Các card thống kê */}
      <div className={styles.statsGrid}>
        <div className={styles.card}><h2>Doanh thu</h2><p>{formatUSD(stats.totalRevenue)}</p></div>
        <div className={styles.card}><h2>Đơn hàng</h2><p>{stats.totalOrders}</p></div>
        <div className={styles.card}><h2>Giá trị TB</h2><p>{formatUSD(stats.avgOrderValue)}</p></div>
        <div className={styles.card}><h2>Khách mới</h2><p>{stats.newCustomers}</p></div>
      </div>

      {/* Biểu đồ */}
      <div className={styles.chartGrid}>
        <div className={styles.chartWrapper}>
          <h2>Doanh thu theo {range === "daily" ? "ngày" : range === "weekly" ? "tuần" : "tháng"}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getTopData(stats.revenueByDate, "revenue")}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatUSD(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartWrapper}>
          <h2>Số đơn hàng theo {range === "daily" ? "ngày" : range === "weekly" ? "tuần" : "tháng"}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getTopData(stats.ordersByDate, "orders")}>
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
        <h2>Đơn hàng gần đây</h2>
        <div className={styles.tableScroll}>
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
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td className={styles.amount}>{formatUSD(order.total)}</td>
                    <td>
                      <span className={
                        order.status === "Fulfilled"
                          ? styles.statusFulfilled
                          : order.status === "Processing"
                          ? styles.statusProcessing
                          : styles.statusCancelled
                      }>
                        <span className={styles.statusDot}></span>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className={styles.noData}>Không có đơn hàng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

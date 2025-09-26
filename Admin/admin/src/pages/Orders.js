import React, { useEffect, useState } from "react";
import styles from "../pages/Orders.module.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/orders");
      if (!res.ok) throw new Error("Không thể tải đơn hàng");
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const order = orders.find((o) => o.id === id);
      if (!order) return;

      const prevStatus = order.status;
      const prevTotal = Number(order.total);

      const res = await fetch(`http://localhost:8000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Không thể cập nhật trạng thái");
      await res.json();

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );

      const validStatuses = ["Processing", "Fulfilled"];
      const wasCounted = validStatuses.includes(prevStatus);
      const isCounted = validStatuses.includes(newStatus);

      let change = 0;
      let revenueChange = 0;

      if (wasCounted && !isCounted) {
        change = -1;
        revenueChange = -prevTotal;
      }
      if (!wasCounted && isCounted) {
        change = +1;
        revenueChange = +prevTotal;
      }

      window.dispatchEvent(
        new CustomEvent("ordersUpdated", { detail: { change, revenueChange } })
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const customerName = o.user?.name || o.customer || "";
    const matchSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Orders Management</h2>

      {/* Bộ lọc */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by customer or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.filterInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All statuses</option>
          <option value="Processing">Processing</option>
          <option value="Fulfilled">Fulfilled</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={() => setStatusFilter("")} className={styles.filterButton}>
          Clear
        </button>
      </div>

      {/* Bảng đơn hàng */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.user?.name || o.customer || "Guest"}</td>
              <td>{new Date(o.created_at).toLocaleDateString("vi-VN")}</td>
              <td>${Number(o.total).toFixed(2)}</td>
              <td>{o.payment || "COD"}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className={`${styles.statusSelect} ${
                    o.status === "Fulfilled"
                      ? styles.statusFulfilled
                      : o.status === "Processing"
                      ? styles.statusProcessing
                      : styles.statusCancelled
                  }`}
                >
                  <option value="Processing">Processing</option>
                  <option value="Fulfilled">Fulfilled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <button
                  className={styles.viewButton}
                  onClick={() => setSelectedOrder(o)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal hiển thị chi tiết */}
      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Order #{selectedOrder.id}</h3>
            <p><b>Customer:</b> {selectedOrder.user?.name || selectedOrder.customer}</p>
            <p><b>Email:</b> {selectedOrder.user?.email || "N/A"}</p>
            <p><b>Payment:</b> {selectedOrder.payment}</p>
            <p>
              <b>Status:</b>{" "}
              <span
                className={`${styles.badge} ${
                  selectedOrder.status === "Fulfilled"
                    ? styles.badgeFulfilled
                    : selectedOrder.status === "Processing"
                    ? styles.badgeProcessing
                    : styles.badgeCancelled
                }`}
              >
                {selectedOrder.status}
              </span>
            </p>
            <p><b>Date:</b> {new Date(selectedOrder.created_at).toLocaleString()}</p>

            <h4>Sản phẩm</h4>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map(item => (
                  <tr key={item.id}>
                    <td>{item.product?.name}</td>
                    <td>{item.quantity}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className={styles.total}><b>Total:</b> ${Number(selectedOrder.total).toFixed(2)}</p>

            <button onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

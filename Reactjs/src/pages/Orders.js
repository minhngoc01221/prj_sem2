import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId"); // lấy userId khi login

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders?user_id=${userId}`);
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
    if (userId) fetchOrders();
  }, [userId]);

  if (!userId) {
    return <p>Bạn cần đăng nhập để xem đơn hàng.</p>;
  }

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-page container mt-4">
      <h2>Đơn hàng của tôi</h2>

      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
                <td>{Number(order.total).toLocaleString("vi-VN")}₫</td>
                <td>
                  <span
                    className={`badge ${
                      order.status === "Fulfilled"
                        ? "bg-success"
                        : order.status === "Cancelled"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{order.payment || "COD"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;

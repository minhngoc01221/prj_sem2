import React, { useEffect, useState } from "react";
import "../css/MyOrderPage.css";

const API_URL = "http://localhost:8000";

const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`);
        const data = await res.json();

        if (Array.isArray(data.data)) {
          const userOrders = data.data.filter((o) => o.user_id === userId);
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Lỗi fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (!userId) {
    return (
      <div className="myorder-container">
        <h2 className="myorder-title">Vui lòng đăng nhập để xem thông tin đơn hàng.</h2>
      </div>
    );
  }

  if (loading) {
    return <p className="myorder-loading">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="myorder-container">
      <h1 className="myorder-title">Đơn hàng của tôi</h1>

      {/* ✅ Thông tin user chỉ hiển thị khi có đơn */}
      {orders.length > 0 && orders[0].user && (
        <div className="user-info">
          <p>
            <strong>Tên:</strong> {orders[0].user.name}
          </p>
          <p>
            <strong>Email:</strong> {orders[0].user.email}
          </p>
        </div>
      )}

      {/* ✅ Nếu chưa có đơn, chỉ hiển thị thông báo */}
      {orders.length === 0 ? (
        <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </td>
                <td>{order.payment}</td>
                <td className="order-total">${Number(order.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrderPage;

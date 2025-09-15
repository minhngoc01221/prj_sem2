import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../css/CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalCost, clearCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  // Hàm checkout: gửi dữ liệu giỏ hàng lên backend
  const handleCheckout = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Bạn cần đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId),
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total: totalCost + 5,
          payment: "COD",
        }),
      });

      if (!res.ok) throw new Error("Không thể tạo đơn hàng");
      const data = await res.json();
      console.log("Order created:", data);

      clearCart(); // Xóa giỏ hàng sau khi đặt hàng thành công
      navigate("/payment-success"); // Điều hướng sang trang xác nhận
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Đặt hàng thất bại, vui lòng thử lại!");
    }
  };

  return (
    <section className="cart-page">
      <div className="cart-left">
        <h2>Shopping Cart ({totalItems} Items)</h2>
        <table>
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt={p.name} className="cart-img" />
                  <div>{p.name}</div>
                  <button onClick={() => removeFromCart(p.id)}>Remove</button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      updateQuantity(p.id, Math.max(1, p.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span>{p.quantity}</span>
                  <button onClick={() => updateQuantity(p.id, p.quantity + 1)}>
                    +
                  </button>
                </td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td>${(p.price * p.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cart-right">
        <h3>Order Summary</h3>
        <p>Items: {totalItems}</p>
        <p>Shipping: $5.00</p>
        <p>
          <b>Total Cost: ${(totalCost + 5).toFixed(2)}</b>
        </p>
        <input type="text" placeholder="Enter promo code" />
        <button className="btn-apply">Apply</button>

        {/* Nút Checkout sẽ gọi API thay vì chỉ điều hướng */}
        <button className="btn-checkout" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
};

export default CartPage;

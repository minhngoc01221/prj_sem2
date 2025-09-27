import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../css/CheckoutPage.css";

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, p) => sum + Number(p.price || 0) * (p.quantity || 0),
    0
  );
  const shipping = 5;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    paymentMethod: "COD",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const requiredFields = ["firstName", "lastName", "address", "city", "phone", "email"];
    const missing = requiredFields.filter((f) => !form[f].trim());

    if (missing.length > 0) {
      alert(`⚠ Vui lòng nhập đầy đủ: ${missing.join(", ")}`);
      return;
    }

    // ✅ Lấy user từ localStorage (ưu tiên "user", fallback "userId")
    let user = null;
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      user = JSON.parse(savedUser);
    } else {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");
      if (userId && userName) {
        user = { id: parseInt(userId), name: userName };
      }
    }

    if (!user) {
      alert("Bạn cần đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          payment: form.paymentMethod,
          address: form.address,
          city: form.city,
          phone: form.phone,
          items: cart.map((p) => ({
            product_id: p.id,
            quantity: p.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Không thể tạo đơn hàng");
      }

      const data = await res.json();
      console.log("✅ Order created:", data);

      localStorage.setItem("lastOrder", JSON.stringify(data));
      clearCart();
      navigate("/payment-success");
    } catch (error) {
      alert("❌ Đặt hàng thất bại, vui lòng thử lại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout">
      <div className="checkout-form">
        <h2>Checkout</h2>
        <input type="text" name="firstName" placeholder="First Name *" value={form.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name *" value={form.lastName} onChange={handleChange} />
        <input type="text" name="address" placeholder="Street Address *" value={form.address} onChange={handleChange} />
        <input type="text" name="city" placeholder="City *" value={form.city} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email *" value={form.email} onChange={handleChange} />

        <h3>Payment Method</h3>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={form.paymentMethod === "COD"}
            onChange={handleChange}
          />
          Thanh toán khi nhận hàng (COD)
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="CreditCard"
            checked={form.paymentMethod === "CreditCard"}
            onChange={handleChange}
          />
          Thẻ tín dụng
        </label>

        <button className="btn-placeorder" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>

      <div className="checkout-summary">
        <h3>Your Order</h3>
        <ul>
          {cart.map((p) => (
            <li key={p.id}>
              {p.name} × {p.quantity} = ${(Number(p.price || 0) * (p.quantity || 0)).toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Shipping: ${shipping.toFixed(2)}</p>
        <p>Discount: -${discount.toFixed(2)}</p>
        <h4>Total: ${total.toFixed(2)}</h4>
      </div>
    </section>
  );
};

export default CheckoutPage;

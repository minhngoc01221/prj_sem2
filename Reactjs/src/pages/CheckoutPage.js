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
    cardNumber: "",
    expDate: "",
    cvc: "",
    accountName: "",
    paymentMethod: "credit",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const requiredFields = ["firstName", "lastName", "address", "city", "phone", "email"];

    // ✅ Validate thẻ
    if (form.paymentMethod === "credit") {
      requiredFields.push("cardNumber", "expDate", "cvc");
      if (!/^\d{16}$/.test(form.cardNumber)) {
        alert("❌ Invalid Credit Card number. Must be 16 digits.");
        return;
      }
      if (!/^\d{3}$/.test(form.cvc)) {
        alert("❌ Invalid CVC. Must be 3 digits.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expDate)) {
        alert("❌ Invalid Expiration Date. Use MM/YY format.");
        return;
      }
    }

    if (form.paymentMethod === "debit") {
      requiredFields.push("cardNumber", "accountName");
      if (!/^\d{10,15}$/.test(form.cardNumber)) {
        alert("❌ Invalid Debit Card number. Must be 10–15 digits.");
        return;
      }
    }

    const missing = requiredFields.filter((f) => !form[f].trim());
    if (missing.length > 0) {
      alert(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    // ✅ Lấy user_id từ LocalStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Bạn cần đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // ✅ Gửi đúng payload backend yêu cầu
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId),
          payment: form.paymentMethod,
          items: cart.map((p) => ({
            product_id: p.id,
            quantity: p.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error("Không thể tạo đơn hàng");
      const data = await res.json();
      console.log("✅ Order created:", data);

      clearCart();
      navigate("/payment-success");
    } catch (error) {
      alert("❌ Thanh toán thất bại, vui lòng thử lại!");
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
        {/* ... giữ nguyên phần chọn credit/debit ... */}

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

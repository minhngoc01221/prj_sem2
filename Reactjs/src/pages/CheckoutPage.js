import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../css/CheckoutPage.css";

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Tính toán đơn hàng
  const subtotal = cart.reduce(
    (sum, p) => sum + Number(p.price || 0) * (p.quantity || 0),
    0
  );
  const shipping = 5;
  const discount = 0;
  const total = subtotal + shipping - discount;

  // Form state
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    const requiredFields = ["firstName", "lastName", "address", "city", "phone", "email"];

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

    // Check field missing
    const missing = requiredFields.filter((f) => !form[f].trim());
    if (missing.length > 0) {
      alert(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    clearCart();
    navigate("/payment-success");
  };

  return (
    <section className="checkout">
      {/* Form bên trái */}
      <div className="checkout-form">
        <h2>Checkout</h2>
        <input type="text" name="firstName" placeholder="First Name *" value={form.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name *" value={form.lastName} onChange={handleChange} />
        <input type="text" name="address" placeholder="Street Address *" value={form.address} onChange={handleChange} />
        <input type="text" name="city" placeholder="City *" value={form.city} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email *" value={form.email} onChange={handleChange} />

        <h3>Payment Method</h3>
        <div className="payment-method">
          {/* Credit card */}
          <label
            className={
              "payment-option " + (form.paymentMethod === "credit" ? "selected" : "")
            }
          >
            <div className="payment-left">
              <span className="option-title">Credit Card</span>
              <div className="pay-logos-inline">
                <img src="/image/visa1.png" alt="Visa" />
                <img src="/image/masterc.png" alt="MasterCard" />
                <img src="/image/gpay.png" alt="G-Pay" />
              </div>
            </div>
            <input
              className="payment-radio"
              type="radio"
              name="paymentMethod"
              value="credit"
              checked={form.paymentMethod === "credit"}
              onChange={handleChange}
            />
          </label>

          {/* Debit card */}
          <label
            className={
              "payment-option " + (form.paymentMethod === "debit" ? "selected" : "")
            }
          >
            <div className="payment-left">
              <span className="option-title">Debit Card (VN)</span>
              <div className="pay-logos-inline">
                <img src="/image/vcb.png" alt="VCB" />
                <img src="/image/mbbank.png" alt="MB" />
                <img src="/image/bidv.png" alt="BIDV" />
              </div>
            </div>
            <input
              className="payment-radio"
              type="radio"
              name="paymentMethod"
              value="debit"
              checked={form.paymentMethod === "debit"}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Fields hiển thị theo phương thức */}
        {form.paymentMethod === "credit" && (
          <>
            <input type="text" name="cardNumber" placeholder="Card Number (16 digits) *" value={form.cardNumber} onChange={handleChange} />
            <input type="text" name="expDate" placeholder="MM/YY *" value={form.expDate} onChange={handleChange} />
            <input type="text" name="cvc" placeholder="CVC (3 digits) *" value={form.cvc} onChange={handleChange} />
          </>
        )}

        {form.paymentMethod === "debit" && (
          <>
            <input type="text" name="cardNumber" placeholder="Debit Card Number (10 - 15 digits) *" value={form.cardNumber} onChange={handleChange} />
            <input type="text" name="accountName" placeholder="Account Holder Name *" value={form.accountName} onChange={handleChange} />
          </>
        )}

        <button className="btn-placeorder" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>

      {/* Summary bên phải */}
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

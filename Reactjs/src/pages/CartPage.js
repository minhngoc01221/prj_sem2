import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../css/CartPage.css";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalCost,
  } = useContext(CartContext);

  const navigate = useNavigate();

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

        {/* ✅ Điều hướng sang trang Checkout */}
        <button
          className="btn-checkout"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
};

export default CartPage;

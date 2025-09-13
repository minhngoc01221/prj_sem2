// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaTruck, FaDollarSign, FaHeadphones, FaWallet } from "react-icons/fa";
import "../css/ProductDetail.css";
import { CartContext } from "../context/CartContext";

const API_URL = "http://localhost/construction_store/api/products.php";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}?id=${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <>
      <section className="product-detail">
        {/* LEFT: hình ảnh */}
        <div className="detail-left">
          <div
            className="detail-img"
            style={{ backgroundImage: `url(${product.image})` }}
          ></div>
        </div>

        {/* RIGHT: thông tin */}
        <div className="detail-right">
          <h2 className="detail-title">{product.name}</h2>
          <p className="detail-price">
            ${Number(product.price).toFixed(2)} USD
          </p>
          <p className="detail-desc">
            The chuck is the part of the drill that holds and secures the drill
            bit. It is often adjustable to accommodate different sizes of drill
            bits.
          </p>

          <div className="detail-qty">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <button className="btn-addtocart" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <div className="detail-info">
            <h3>Product Info</h3>
            <ul>
              <li>Available in stock</li>
              <li>Secure packaging</li>
              <li>Non-returnable items</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <FaTruck className="feature-icon" />
          <h4>Free shipping</h4>
          <p>Enjoy the convenience of free shipment on all your orders.</p>
        </div>

        <div className="feature">
          <FaDollarSign className="feature-icon" />
          <h4>Easy refund</h4>
          <p>Shop with confidence with our easy refund policy.</p>
        </div>

        <div className="feature">
          <FaHeadphones className="feature-icon" />
          <h4>Online support</h4>
          <p>Our dedicated support team is just a click away.</p>
        </div>

        <div className="feature">
          <FaWallet className="feature-icon" />
          <h4>Flexible payment</h4>
          <p>We understand that flexibility is key when it comes to payments.</p>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;

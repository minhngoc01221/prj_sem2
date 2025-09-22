import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FaTruck, FaDollarSign, FaHeadphones, FaWallet } from "react-icons/fa";
import "../css/ProductDetail.css";
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/products/${id}`);
          if (!res.ok) throw new Error("Failed to fetch product");
          const data = await res.json();
          setProduct(data);
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

  if (!product) return <p className="loading">Loading product...</p>;

  return (
    <>
      <section className="product-detail">
        <div className="detail-left">
          <div className="detail-img">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="detail-main-img"
            />
          </div>
        </div>

        <div className="detail-right">
          <h2 className="detail-title">{product.name}</h2>
          <p className="detail-price">${Number(product.price).toFixed(2)} USD</p>
          <p className="detail-desc">
            {product.description ||
              "This is a high-quality building product trusted by professionals."}
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

          <button className="btn-addtocart" onClick={() => addToCart(product, quantity)}>
            Add to Cart
          </button>

          <div className="detail-info">
            <h3>Product Info</h3>
            <ul>
              <li>Available in stock: {product.stock ?? "N/A"}</li>
              <li>Secure packaging</li>
              <li>Non-returnable items</li>
            </ul>
          </div>
        </div>
      </section>

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

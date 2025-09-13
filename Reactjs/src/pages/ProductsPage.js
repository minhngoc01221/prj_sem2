import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ProductsPage.css";
import { CartContext } from "../context/CartContext";

const API_URL = "http://localhost/construction_store/api/products.php";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="loading">Loading products...</p>;

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="products">
      <header className="products-header">
        <h2>Discover High-Quality Building Products</h2>
        <p>
          We offer a curated selection of durable, high-performance building
          products trusted by professionals.
        </p>
      </header>

      <div className="products-grid">
        {currentProducts.map((p) => (
          <div key={p.id} className="product-card">
            <div
              className="product-img"
              style={{ backgroundImage: `url(${p.image})` }}
            />
            <h3>{p.name}</h3>
            <div className="product-rating">
              {"★".repeat(p.rating)}{"☆".repeat(5 - p.rating)}
            </div>
            <p className="product-price">${Number(p.price).toFixed(2)}</p>

            {/* 2 nút Add + Review */}
            <div className="product-actions">
              <button className="btn-add" onClick={() => addToCart(p)}>
                Add to Cart
              </button>
              <button
                className="btn-review"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
          &laquo;&laquo;
        </button>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          &laquo;
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          &raquo;&raquo;
        </button>
      </div>
    </section>
  );
};

export default ProductsPage;

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ProductsPage.css";
import { CartContext } from "../context/CartContext";

const fallbackImages = [
  "/image/product1.jpg",
  "/image/product2.jpg",
  "/image/product3.jpg",
  "/image/product4.jpg",
  "/image/product5.jpg",
  "/image/product6.jpg",
];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const withImages = (data.data || []).map((p, idx) => ({
          ...p,
          thumbnail: p.thumbnail || fallbackImages[idx % fallbackImages.length],
        }));

        setProducts(withImages);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!products.length)
    return <p className="no-products">Không có sản phẩm nào để hiển thị.</p>;

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
            <div className="product-img">
              <img src={p.thumbnail} alt={p.name} loading="lazy" />
            </div>

            <h3>{p.name}</h3>
            <div className="product-rating">
              {"★".repeat(p.rating || 0)}
              {"☆".repeat(5 - (p.rating || 0))}
            </div>
            <p className="product-price">${Number(p.price).toFixed(2)}</p>

            <div className="product-actions">
              <button className="btn-add" onClick={() => addToCart(p)}>
                Add to Cart
              </button>
              <button
                className="btn-review"
                onClick={() =>
                  navigate(`/products/${p.id}`, {
                    state: { product: p }, // ✅ Truyền dữ liệu product sang trang detail
                  })
                }
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
          &laquo;&laquo;
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
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

import React, { useEffect, useState } from "react";
import "../styles/products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState(""); // 👈 state cho tìm kiếm

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý input form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Thêm hoặc cập nhật sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    try {
      const url = editingId
        ? `http://localhost:8000/api/products/${editingId}`
        : "http://localhost:8000/api/products";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error(editingId ? "Failed to update product" : "Failed to add product");

      const updatedProduct = await res.json();

      if (editingId) {
        setProducts(products.map((p) => (p.id === editingId ? updatedProduct : p)));
      } else {
        setProducts([updatedProduct, ...products]);
      }

      setForm({ name: "", sku: "", price: "", stock: "", thumbnail: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving product:", err);
      setError(editingId ? "Lỗi cập nhật sản phẩm" : "Lỗi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Lỗi khi xóa sản phẩm");
    }
  };

  // Sửa sản phẩm
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail || "",
    });
    setEditingId(product.id);
  };

  // Hủy chế độ edit
  const handleCancelEdit = () => {
    setForm({ name: "", sku: "", price: "", stock: "", thumbnail: "" });
    setEditingId(null);
  };

  // 🔎 Lọc sản phẩm theo tên hoặc SKU
  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <h2>Admin - Products Management</h2>

      {/* Form thêm / sửa sản phẩm */}
      <div className="product-card">
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        <form className="product-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="thumbnail"
            placeholder="Thumbnail URL"
            value={form.thumbnail}
            onChange={handleChange}
          />
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>
            {editingId && (
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="product-search">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm theo tên hoặc SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Bảng sản phẩm */}
      <div className="product-table-card">
        <h3>Product List</h3>
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Thumbnail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.thumbnail && <img src={p.thumbnail} alt={p.name} width="50" />}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#6b7280" }}>
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;

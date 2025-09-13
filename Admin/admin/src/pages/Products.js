// src/pages/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/products.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    thumbnail: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy danh sách sản phẩm
  const fetchProducts = () => {
    axios.get("http://localhost:8000/api/products")
      .then(res => {
        setProducts(res.data.data || []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý input form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Thêm sản phẩm
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    axios.post("http://localhost:8000/api/products", payload)
      .then(res => {
        setProducts([res.data, ...products]);
        setForm({ name: "", sku: "", price: "", stock: "", thumbnail: "" });
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
          setError(Object.values(err.response.data.errors).join(" | "));
        } else {
          setError("Lỗi thêm sản phẩm");
        }
      })
      .finally(() => setLoading(false));
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    axios.delete(`http://localhost:8000/api/products/${id}`)
      .then(res => {
        setProducts(products.filter(p => p.id !== id));
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi khi xóa sản phẩm");
      });
  };

  return (
    <div className="products-page">
      <h2>Admin - Products Management</h2>

      {/* Form thêm sản phẩm */}
      <div className="product-card">
        <h3>Add New Product</h3>
        <form className="product-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
          <input type="text" name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />
          <input type="text" name="thumbnail" placeholder="Thumbnail URL" value={form.thumbnail} onChange={handleChange} />
          <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
        </form>
        {error && <p className="error">{error}</p>}
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
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>{p.thumbnail && <img src={p.thumbnail} alt={p.name} width="50" />}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;

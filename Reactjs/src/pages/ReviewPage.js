import React, { useEffect, useState } from "react";
import "../css/ReviewsPage.css";

const API_URL = "http://localhost:8000/api/reviews";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ feedback: "", rating: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [canReview, setCanReview] = useState(false);

  // ✅ Lấy user và kiểm tra có đơn hàng chưa
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Lấy toàn bộ orders rồi lọc theo user_id
      fetch("http://localhost:8000/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.data)) {
            const userOrders = data.data.filter((o) => o.user_id === parsedUser.id);
            if (userOrders.length > 0) setCanReview(true);
          }
        })
        .catch((err) => console.error("❌ Lỗi khi kiểm tra đơn hàng:", err));
    }
  }, []);

  // ✅ Lấy danh sách review
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("❌ Lỗi khi tải reviews:", err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleStarClick = (star) => setForm({ ...form, rating: star });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.feedback || form.rating === 0) {
      alert("Vui lòng nhập feedback và chọn số sao!");
      return;
    }
    if (!user) return alert("Bạn cần đăng nhập!");
    if (!canReview) return alert("Bạn cần đặt ít nhất 1 đơn hàng trước khi review!");

    const payload = {
      product_id: 1, // 👈 ở đây nên thay bằng product thật sự
      customer_id: user.id,
      rating: form.rating,
      comment: form.feedback,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // nếu có token thì gửi kèm
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Không thể gửi feedback");
      const newReview = await res.json();
      setReviews([...reviews, newReview]);
      setForm({ feedback: "", rating: 0 });
    } catch (err) {
      console.error("❌ Lỗi khi gửi feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <section className="review-section">
      <div className="review-header">
        <h3>Client Feedback</h3>
        <h2>Trusted by DMN Store</h2>
        <p>Nghe chia sẻ từ khách hàng đã mua sản phẩm của chúng tôi</p>
      </div>

      <div className="review-carousel">
        <button className="nav-btn" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>
          &lt;
        </button>

        <div className="review-grid">
          {visibleReviews.length > 0 ? (
            visibleReviews.map((r, idx) => (
              <div className="review-card" key={idx}>
                <div className="review-author-top">
                  <img
                    src={`https://i.pravatar.cc/50?u=${r.customer_id || r.id}`}
                    alt={r.customer?.name || "user"}
                    className="review-avatar"
                  />
                  <span className="review-name">{r.customer?.name || "Khách hàng"}</span>
                </div>
                <p className="review-text">"{r.comment}"</p>
                <div className="review-rating">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </div>
              </div>
            ))
          ) : (
            <p>Hiện chưa có đánh giá nào.</p>
          )}
        </div>

        <button
          className="nav-btn"
          onClick={() => setCurrentIndex(Math.min(currentIndex + 1, reviews.length - 3))}
        >
          &gt;
        </button>
      </div>

      {user ? (
        canReview ? (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <h3>Gửi đánh giá</h3>
            <textarea
              name="feedback"
              placeholder="Viết cảm nhận..."
              value={form.feedback}
              onChange={handleChange}
            />
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={form.rating >= star ? "star selected" : "star"}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi Feedback"}
            </button>
          </form>
        ) : (
          <p className="login-message">Bạn cần đặt ít nhất một đơn hàng để gửi đánh giá.</p>
        )
      ) : (
        <p className="login-message">
          Bạn cần <a href="/login">đăng nhập</a> để gửi đánh giá.
        </p>
      )}
    </section>
  );
};

export default ReviewsPage;

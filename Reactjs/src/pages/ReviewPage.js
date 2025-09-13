import React, { useEffect, useState } from "react";
import "../css/ReviewsPage.css";

const API_URL = "http://localhost/construction_store/api/reviews.php";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", feedback: "", rating: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error loading reviews:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStarClick = (star) => {
    setForm({ ...form, rating: star });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.feedback || !form.rating) {
      alert("Please fill in all fields including rating.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setReviews([...reviews, data]);
      setForm({ name: "", feedback: "", rating: 0 });
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  // Lấy 3 review để hiển thị
  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const nextSlide = () => {
    if (currentIndex + 3 < reviews.length) setCurrentIndex(currentIndex + 1);
  };

  return (
    <section className="review-section">
      <div className="review-header">
        <h3>Client Feedback</h3>
        <h2>Trusted by DMN Store</h2>
        <p>
          Hear from our happy customers who trusted our products and services.
        </p>
      </div>

      {/* Carousel */}
      <div className="review-carousel">
        <button className="nav-btn" onClick={prevSlide} disabled={currentIndex === 0}>
          &lt;
        </button>

        <div className="review-grid">
  {visibleReviews.map((r, idx) => (
    <div className="review-card" key={idx}>
      {/* Avatar + Tên lên đầu */}
      <div className="review-author-top">
        <img
          src={`https://i.pravatar.cc/50?u=${r.name}`}
          alt={r.name}
          className="review-avatar"
        />
        <span className="review-name">{r.name}</span>
      </div>

      {/* Nội dung feedback */}
      <p className="review-text">"{r.feedback}"</p>

      {/* Rating sao */}
      <div className="review-rating">{"★".repeat(r.rating)}</div>
    </div>
  ))}
</div>

        <button
          className="nav-btn"
          onClick={nextSlide}
          disabled={currentIndex + 3 >= reviews.length}
        >
          &gt;
        </button>
      </div>

      {/* Form feedback */}
      <form className="feedback-form" onSubmit={handleSubmit}>
        <h3>Send your feedback</h3>
        <input
          type="text"
          name="name"
          placeholder="Your Name *"
          value={form.name}
          onChange={handleChange}
        />
        <textarea
          name="feedback"
          placeholder="Your Feedback *"
          value={form.feedback}
          onChange={handleChange}
        ></textarea>

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

        <button type="submit" className="btn-send">
          Send Feedback
        </button>
      </form>
    </section>
  );
};

export default ReviewPage;

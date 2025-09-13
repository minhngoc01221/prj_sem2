import React from "react";
import "../css/HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home">
      <section
        className="hero"
        style={{ backgroundImage: "url(/image/HomePage.jpeg)" }}
      >
        <div className="hero-content">
          <h1>
            SMART CHOICE <span className="highlight">SMART QUALITY</span>
          </h1>
          <h2>Solid Quality – MAKE THE FUTURE</h2>
          <p>
            Providing high-quality construction materials – from cement and steel to bricks and sand. Make smart choices, build durable projects, with fast delivery straight to your site.
          </p>
          <Link to="/products">
          <button className="cta-btn">VIEW MORE PRODUCT</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
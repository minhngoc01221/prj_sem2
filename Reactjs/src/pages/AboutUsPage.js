import React, { useState } from "react";
import "../css/AboutUs.css";

const AboutUs = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="aboutus">
      <div className="aboutus-inner">
        {/* LEFT: title + tagline + chevrons décor */}
        <div className="aboutus-left">
          <div className="aboutus-chevrons" aria-hidden="true" />
          <h2 className="aboutus-title">ABOUT US</h2>
          <p className="tagline">
            The leaders in the construction industry.
          </p>
        </div>

        {/* RIGHT: description + read more */}
        <div className="aboutus-right">
          <p>
            At DMN Store, we believe that every great structure begins with a strong foundation — not only in design, but in the quality of materials used. Established with a vision to serve as a reliable one-stop destination for construction solutions, we have grown into a trusted name for contractors, architects, and homeowners alike.
            <br></br>
            With years of experience in the construction and building materials industry, we provide a wide range of high-quality products that meet international standards. From cement, steel, and roofing materials to finishing products, tiles, and custom solutions, our catalog is designed to cover every stage of a project. We carefully select suppliers and partners to ensure that durability, safety, and sustainability remain at the heart of everything we offer.
            <br></br>
            Beyond products, what sets us apart is our dedication to service and partnership. Our team of experts works closely with clients to understand their unique needs, recommend the right materials, and deliver on time — every time. Whether you are renovating a home, managing a large commercial build, or designing a custom solution, you can count on us for guidance, technical knowledge, and dependable support.
          </p>

          {expanded && (
            <p className="more-text">
              Our mission is to deliver durable, cost–effective, and sustainable products that help our clients build with confidence. Whether it’s renovation, design and building, or custom solutions, we strive to ensure every project is completed with excellence.
              <br></br>
              At DMN Store, we don’t just sell building materials — we help you build confidence, reliability, and long-lasting value. Together, let’s create spaces that inspire, protect, and endure.
            </p>
          )}

          <button
            className="btn-primary"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "READ LESS" : "READ MORE"}
          </button>
        </div>
      </div>

      {/* FEATURE TILES (4 ô) */}
      <div className="aboutus-tiles">
        <article className="tile" style={{ backgroundImage: "url(/image/AboutUs1.jpg)" }}>
          <div className="tile-overlay" />
          <h3>RENOVATION BUILDINGS</h3>
          <p>High-quality renovation services, improve value of buildings.</p>
        </article>

        <article className="tile" style={{ backgroundImage: "url(/image/AboutUs2.jpg)" }}>
          <div className="tile-overlay" />
          <h3>DESIGN AND BUILDING</h3>
          <p>Creative Design & Quality Construction.</p>
        </article>

        <article className="tile" style={{ backgroundImage: "url(/image/AboutUs3.jpg)" }}>
          <div className="tile-overlay" />
          <h3>PAINTING AND ROOFING</h3>
          <p>Roofing Solutions with Painting Expertise.</p>
        </article>

        <article className="tile" style={{ backgroundImage: "url(/image/AboutUs4.jpg)" }}>
          <div className="tile-overlay" />
          <h3>SOLUTIONS CONSTRUCTION</h3>
          <p>Smart Solutions for Every Build.</p>
        </article>
      </div>
    </section>
  );
};

export default AboutUs;

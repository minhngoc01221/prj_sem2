import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/Footer.css";

const Footer = () => {
  const [settings, setSettings] = useState({
    company_name: "DMN Store",
    address: "123 Street X, District Y, Ho Chi Minh City",
  });

  // Fetch data from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/settings/general");
        setSettings({
          company_name: res.data.company_name || "DMN Store",
          address: res.data.address || "123 Street X, District Y, Ho Chi Minh City",
        });
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-overlay">
        <div className="footer-content">
          {/* About */}
          <div className="footer-col">
            <h3>About {settings.company_name}</h3>
            <p>
              Providing high-quality construction materials: cement, steel, bricks,
              sand/stone… Smart choice – Sustainable construction.
            </p>
            <p>
              Fast delivery, transparent pricing, dedicated technical support for
              all projects from residential to commercial.
            </p>
          </div>

          {/* Latest News */}
          <div className="footer-col">
            <h3>Latest News</h3>
            <ul>
              <li>
                <Link to="/products?cat=cement">Cement price updates</Link>
                <span>05 September {new Date().getFullYear()}</span>
              </li>
              <li>
                <Link to="/reviews">Customer feedback on {settings.company_name}</Link>
                <span>31 August {new Date().getFullYear()}</span>
              </li>
              <li>
                <Link to="/products?cat=steel">New steel price list</Link>
                <span>20 August {new Date().getFullYear()}</span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h3>Services</h3>
            <ul>
              <li><Link to="/products">Material supply</Link></li>
              <li><Link to="/about">Technical consulting</Link></li>
              <li><Link to="/cart">Delivery service</Link></li>
              <li><Link to="/reviews">Warranty & After-sales</Link></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="footer-col">
            <h3>Get In Touch</h3>
            {/* Address clickable to open Google Maps */}
            <p>
              📍{" "}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.address}
              </a>
            </p>
            <p>☎️ 0900 000 000</p>
            <p>✉️ support@dmnstore.vn</p>
            <p>🕒 08:00 – 17:30 (Mon–Sat)</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} {settings.company_name}. All rights reserved. Designed by Dat · Minh · Ngoc
        </div>
      </div>
    </footer>
  );
};

export default Footer;

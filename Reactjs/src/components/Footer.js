import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/Footer.css";

const Footer = () => {
  const [settings, setSettings] = useState({
    company_name: "DMN Store",
    address: "123 Đường X, Quận Y, TP.HCM",
  });

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/settings/general");
        setSettings({
          company_name: res.data.company_name || "DMN Store",
          address: res.data.address || "123 Đường X, Quận Y, TP.HCM",
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
              Cung cấp vật liệu xây dựng chất lượng cao: xi măng, sắt thép, gạch,
              cát/đá… Lựa chọn thông minh – Xây dựng bền vững.
            </p>
            <p>
              Giao nhanh tận nơi, báo giá minh bạch, hỗ trợ kỹ thuật tận tâm cho mọi
              công trình từ dân dụng đến dự án.
            </p>
          </div>

          {/* Latest News */}
          <div className="footer-col">
            <h3>Latest News</h3>
            <ul>
              <li>
                <Link to="/products?cat=cement">Cập nhật giá xi măng</Link>
                <span>05 September {new Date().getFullYear()}</span>
              </li>
              <li>
                <Link to="/reviews">Khách hàng nói gì về {settings.company_name}</Link>
                <span>31 August {new Date().getFullYear()}</span>
              </li>
              <li>
                <Link to="/products?cat=steel">Bảng giá sắt thép mới</Link>
                <span>20 August {new Date().getFullYear()}</span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h3>Services</h3>
            <ul>
              <li><Link to="/products">Cung ứng vật liệu</Link></li>
              <li><Link to="/about">Tư vấn kỹ thuật</Link></li>
              <li><Link to="/cart">Giao hàng tận nơi</Link></li>
              <li><Link to="/reviews">Bảo hành – Hậu mãi</Link></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="footer-col">
            <h3>Get In Touch</h3>
            {/* Địa chỉ click được để mở Google Maps */}
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
            <p>🕒 08:00 – 17:30 (T2–T7)</p>
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

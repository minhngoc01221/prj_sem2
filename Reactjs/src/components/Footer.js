import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Overlay không cần nếu không có ảnh, nhưng giữ lại cũng không sao */}
      <div className="footer-overlay">
        <div className="footer-content">
          {/* About */}
          <div className="footer-col">
            <h3>About DMN Store</h3>
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
                <Link to="/reviews">Khách hàng nói gì về DMN</Link>
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
            <p>📍 123 Đường X, Quận Y, TP.HCM</p>
            <p>☎️ 0900 000 000</p>
            <p>✉️ support@dmnstore.vn</p>
            <p>🕒 08:00 – 17:30 (T2–T7)</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} DMN Store. All rights reserved. Designed by Dat · Minh · Ngoc
        </div>
      </div>
    </footer>
  );
};

export default Footer;
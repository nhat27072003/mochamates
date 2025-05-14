import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-section home-section">
      {/* Section 1: Giới thiệu tổng quan */}
      <div className="container">
        <h1 className="home-title text-center py-3">Về Chúng Tôi</h1>
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src="/img/banner3.jpg"
              alt="Cà phê Mochamates"
              className="about-image img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6">
            <div className="about-content">
              <h2 className="about-subtitle">Câu Chuyện Của Chúng Tôi</h2>
              <p className="about-text">
                Mochamates được thành lập với niềm đam mê mang đến những ly cà phê đậm đà, chất lượng cao từ Việt Nam ra thế giới. Chúng tôi kết hợp truyền thống pha chế phin cổ điển với hương vị hiện đại, sử dụng 100% hạt cà phê nguyên chất từ cao nguyên.
              </p>
              <h2 className="about-subtitle">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="about-text">
                Mang đến trải nghiệm cà phê tuyệt vời cho mọi khách hàng, từ cà phê pha sẵn tiện lợi đến hạt rang xay thủ công. Chúng tôi cam kết phát triển bền vững, hỗ trợ nông dân địa phương và bảo vệ môi trường.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Thông tin chi tiết về Mochamates */}
      <div className="container mt-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="about-title text-brown">Tìm Hiểu Về Mochamates</h2>
            <p className="text-muted mb-4">
              Tại Mochamates, chúng tôi đam mê tạo ra những ly cà phê hoàn hảo. Hành trình của chúng tôi bắt đầu tại Hà Nội vào năm 2018, với mục tiêu mang cà phê Việt Nam đích thực đến mọi gia đình.
            </p>
            <div className="row">
              <div className="col-md-6">
                <h5 className="text-green">Sứ Mệnh</h5>
                <ul className="list-unstyled">
                  <li><i className="bi bi-check-circle me-2 text-green"></i>Hạt Cà Phê Chất Lượng</li>
                  <li><i className="bi bi-check-circle me-2 text-green"></i>Khách Hàng Hài Lòng</li>
                  <li><i className="bi bi-check-circle me-2 text-green"></i>Nguồn Cung Bền Vững</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h5 className="text-green">Tầm Nhìn</h5>
                <ul className="list-unstyled">
                  <li><i className="bi bi-bullseye me-2 text-green"></i>Văn Hóa Cà Phê Toàn Cầu</li>
                  <li><i className="bi bi-bullseye me-2 text-green"></i>Đỉnh Cao Cà Phê</li>
                  <li><i className="bi bi-bullseye me-2 text-green"></i>Kết Nối Cộng Đồng</li>
                </ul>
              </div>
            </div>
            <a href="#" className="btn btn-custom mt-4">Khám Phá Câu Chuyện</a>
          </div>
          <div className="col-md-6">
            <img
              src="/img/img_about.jpg"
              alt="Quán Cà phê Mochamates"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Thống kê */}
      <div className="container mt-5">
        <div className="row text-center">
          <div className="col-md-3 col-6 mb-4">
            <i className="bi bi-cup-straw fs-1 text-brown mb-2"></i>
            <h2 className="fw-bold">200+</h2>
            <p className="text-muted">Loại Cà Phê</p>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <i className="bi bi-bag fs-1 text-brown mb-2"></i>
            <h2 className="fw-bold">5000+</h2>
            <p className="text-muted">Đơn Hàng Đã Phục Vụ</p>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <i className="bi bi-star fs-1 text-brown mb-2"></i>
            <h2 className="fw-bold">100+</h2>
            <p className="text-muted">Đánh Giá Tích Cực</p>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <i className="bi bi-geo-alt fs-1 text-brown mb-2"></i>
            <h2 className="fw-bold">10+</h2>
            <p className="text-muted">Thành Phố Đã Phục Vụ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
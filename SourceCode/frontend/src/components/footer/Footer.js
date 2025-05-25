import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brown text-white py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-4">
            <h5 className="mb-4 text-white">About Mochamates</h5>
            <p className="mb-4">
              Mochamates is your destination for authentic Vietnamese coffee. Founded in Hanoi in 2018, we craft every cup with passion and sustainability.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon bg-green"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon bg-green"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon bg-green"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon bg-green"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-4">
            <h5 className="mb-4 text-white">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="footer-link">Home</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Menu</a></li>
              <li className="mb-2"><a href="#" className="footer-link">About</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Contact</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4">
            <h5 className="mb-4 text-white">Our Offerings</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="footer-link">Coffee Beans</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Brewed Coffee</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Gift Sets</a></li>
              <li className="mb-2"><a href="#" className="footer-link">Accessories</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-4">
            <h5 className="mb-4 text-white">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                12 Đinh Tiên Hoàng, Hoàn Kiếm, Hanoi, Vietnam
              </li>
              <li className="mb-3">
                <i className="fas fa-phone me-2"></i>
                <a href="tel:+84987654321" className="footer-link">+84 987 654 321</a>
              </li>
              <li className="mb-3">
                <i className="fas fa-envelope me-2"></i>
                <a href="mailto:info@mochamates.com" className="footer-link">info@mochamates.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <hr className="bg-light mb-4" />
            <div className="text-center">
              <p className="mb-0">© 2025 Mochamates. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
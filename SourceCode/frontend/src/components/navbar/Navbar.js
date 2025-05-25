import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../Button/Button';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(3); // Mô phỏng số lượng sản phẩm trong giỏ
  const [searchQuery, setSearchQuery] = useState(''); // Theo dõi giá trị tìm kiếm
  const location = useLocation();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const isActive = (path) => location.pathname === path;
  const isMenuActive = () => {
    const menuPaths = ['/ready-coffee', '/ground-coffee', '/package-coffee'];
    return menuPaths.some(path => location.pathname.startsWith(path));
  };
  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-custom">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand text-white">Mochamates</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Mở/Đóng menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link text-white ${isActive('/') ? 'active' : ''}`}
                aria-current="page"
              >
                Trang Chủ
              </Link>
            </li>
            <li className='nav-item dropdown'>
              <div
                className={`nav-link dropdown-toggle text-white ${isMenuActive() ? 'active' : ''}`}
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Menu
              </div>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li >
                  <Link
                    className={`dropdown-item ${isActive('/ready-coffee') ? 'active' : ''}`}
                    to="/ready-coffee"
                  >
                    Cà Phê Pha Sẵn
                  </Link>
                </li>
                <li>
                  <Link
                    className={`dropdown-item ${isActive('/ground-coffee') ? 'active' : ''}`}
                    to="/ground-coffee"
                  >
                    Cà Phê Hạt
                  </Link>
                </li>
                <li>
                  <Link
                    className={`dropdown-item ${isActive('/package-coffee') ? 'active' : ''}`}
                    to="/package-coffee"
                  >
                    Cà Phê Hòa Tan
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className={`nav-link text-white ${isActive('/about') ? 'active' : ''}`}
              >
                Về Chúng Tôi
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className={`nav-link text-white ${isActive('/contact') ? 'active' : ''}`}
              >
                Liên Hệ
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <div className="search-bar d-flex align-items-center me-3 position-relative">
              <i className="bi bi-search me-2 text-dark"></i>
              <input
                className="search-input"
                type="search"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <span
                  className="search-result text-white bg-dark p-1 rounded"
                  style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}
                >
                  Kết quả cho "{searchQuery}" (Mô phỏng: {searchQuery.length} sản phẩm)
                </span>
              )}
            </div>
            <div className="cart-icon text-white position-relative me-4 right-icon">
              <i className="bi bi-cart2" style={{ fontSize: '24px' }}></i>
              {cartCount > 0 && (
                <span className="badge bg-danger position-absolute top-7 start-100 translate-middle cart-count">
                  {cartCount}
                </span>
              )}
            </div>
            <i className="bi bi-person-circle me-3 right-icon text-white " style={{ fontSize: '24px' }}></i>
            <Link to="/signin">
              <Button variant='custom'>Đăng Nhập</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
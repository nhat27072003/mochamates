import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Button from '../Button/Button';
import { FaUserEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../../redux/userSlice';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const cartCount = useSelector((state) => state.cart.items.length, shallowEqual);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated, shallowEqual);
  const currentUser = useSelector((state) => state.user.currentUser, shallowEqual);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/signin');
  };

  const isActive = (path) => location.pathname === path;
  const isMenuActive = () => {
    const menuPaths = ['/ready-coffee', '/ground-coffee', '/package-coffee'];
    return menuPaths.some((path) => location.pathname.startsWith(path));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-custom">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand text-white">
          Mochamates
        </Link>
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
            <li className="nav-item dropdown">
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
                <li>
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
            <Link className="text-white me-4 search" to="/search">
              <FiSearch /> Tìm Kiếm
            </Link>
            <Link to="/cart" className="cart-icon text-white position-relative me-4 right-icon">
              <i className="bi bi-cart2" style={{ fontSize: '24px' }}></i>
              {cartCount > 0 && (
                <span className="badge bg-danger position-absolute cart-count">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative dropdown-container">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center focus:outline-none right-icon border-0 bg-transparent"
                >
                  <i
                    className="bi bi-person-circle text-white"
                    style={{ fontSize: '24px' }}
                  ></i>
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu show" style={{ right: 0, top: '100%', minWidth: '200px', zIndex: 1000 }}>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-white">
                        {currentUser?.username || 'User'}
                      </div>
                      {/* <div className="text-sm text-white">
                        {currentUser?.userId || 'No email'}
                      </div> */}
                    </div>
                    <div className="py-1">
                      <Link
                        to="/order"
                        className="dropdown-item flex items-center"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserEdit className="mr-3" />
                        Đơn hàng của tôi
                      </Link>
                      <Link
                        to="/profile"
                        className="dropdown-item flex items-center"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserEdit className="mr-3" />
                        Cập nhật thông tin
                      </Link>
                      <Link
                        to="/change-password"
                        className="dropdown-item flex items-center"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaKey className="mr-3" />
                        Đổi mật khẩu
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item flex items-center text-red-600 hover:bg-red-50"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin">
                <Button variant="custom">Đăng Nhập</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);

// SideBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  return (
    <ul className="navbar-nav bg-gradient-custom sidebar sidebar-dark accordion" id="accordionSidebar">
      <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
        <div className="sidebar-brand-icon">
          <i className="fas fa-coffee"></i>
        </div>
        <div className="sidebar-brand-text mx-3">Mochamates Admin</div>
      </a>
      <hr className="sidebar-divider my-0" />
      <li className="nav-item active">
        <Link className="nav-link" to="/admin/dashboard">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Bảng Điều Khiển</span>
        </Link>
      </li>
      <hr className="sidebar-divider" />
      <div className="sidebar-heading">Quản Lý</div>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/users">
          <i className="fas fa-fw fa-users"></i>
          <span>Quản Lý Người Dùng</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/products">
          <i className="fas fa-fw fa-box"></i>
          <span>Quản Lý Sản Phẩm</span>
        </Link>
      </li>
      <hr className="sidebar-divider" />
      <div className="sidebar-heading">Báo Cáo</div>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/reports">
          <i className="fas fa-fw fa-chart-line"></i>
          <span>Báo Cáo</span>
        </Link>
      </li>
      <hr className="sidebar-divider d-none d-md-block" />
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </ul>
  );
};

export default SideBar;
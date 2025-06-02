import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiList, FiUsers, FiDollarSign, FiSearch, FiSun, FiMoon, FiBell, FiLogOut, FiHome, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/userSlice";


const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const menuItems = [
    { icon: <FiHome />, label: "Dashboard", link: "/admin" },
    {
      icon: <FiShoppingCart />,
      label: "Quản lý đơn hàng", link: "/admin/orders",
      // dropdown: [
      //   { label: "Xử lý đơn hàng", link: "/admin/orders/pending" },
      //   { label: "Cập nhật đơn hàng", link: "/admin/orders/update" },
      //   { label: "Lịch sử đơn hàng", link: "/admin/orders/history" },
      // ],
    },
    { icon: <FiList />, label: "Quản lý sản phẩm", link: "/admin/products" },
    { icon: <FiUsers />, label: "Quản lý khách hàng", link: "/admin/users" },
    // { icon: <FiDollarSign />, label: "Báo cáo doanh thu", link: "/admin/revenu" },
  ];

  useEffect(() => {
    // Cập nhật activeTab dựa trên đường dẫn hiện tại
    const currentPath = location.pathname;
    menuItems.forEach((item) => {
      if (item.link && currentPath.startsWith(item.link)) {
        setActiveTab(item.label);
      } else if (item.dropdown) {
        item.dropdown.forEach((subItem) => {
          if (currentPath.startsWith(subItem.link)) {
            setActiveTab(item.label);
            setIsOrderDropdownOpen(true);
          }
        });
      }
    });
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-white");
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };
  const toggleOrderDropdown = () => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
  };

  return (
    <div className={`d-flex vh-100 overflow ${darkMode ? "bg-dark text-white" : ""}`}>
      {/* Sidebar */}
      <div className={`bg-light border-end p-3 ${darkMode ? "bg-secondary" : "bg-white"}`} style={{ width: "260px" }}>
        <div className="text-center mb-4">
          <img
            src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9"
            alt="Logo"
            className="rounded-circle"
            width="50"
          />
        </div>
        <ul className="nav flex-column">
          {menuItems.map((item, idx) =>
            item.dropdown ? (
              <li key={idx} className="nav-item mb-2 position-relative">
                <button
                  className={`btn w-100 text-start ${activeTab === item.label ? "btn-primary" : "btn-outline-secondary"} d-flex justify-content-between align-items-center`}
                  onClick={toggleOrderDropdown}
                >
                  {item.icon} <span className="ms-2 flex-grow-1">{item.label}</span>
                  {/* {isOrderDropdownOpen ? <FiChevronUp /> : <FiChevronDown />} */}
                </button>
                {/* {isOrderDropdownOpen && (
                  <ul className="list-unstyled mt-2 ms-4">
                    {item.dropdown.map((subItem, subIdx) => (
                      <li key={subIdx} className="nav-item mb-1">
                        <button
                          className={`btn w-100 text-start ${location.pathname === subItem.link ? "btn-primary" : "btn-outline-secondary"}`}
                          onClick={() => {
                            setActiveTab(item.label);
                            navigate(subItem.link);
                          }}
                        >
                          <span className="ms-3">{subItem.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )} */}
              </li>
            ) : (
              <li key={idx} className="nav-item mb-2">
                <button
                  className={`btn w-100 text-start ${activeTab === item.label ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => {
                    setActiveTab(item.label);
                    navigate(item.link);
                  }}
                >
                  {item.icon} <span className="ms-2">{item.label}</span>
                </button>
              </li>
            )
          )}
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start `}
              onClick={() => { handleLogout() }}
            >
              <FiLogOut /> <span className="ms-2">Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <header className={`bg-light border-bottom py-2 px-4 d-flex justify-content-between align-items-center ${darkMode ? "bg-secondary" : "bg-white"}`}>
          <div className="input-group w-25">
            <span className="input-group-text bg-white border-end-0">
              <FiSearch />
            </span>
            <input
              className="form-control border-start-0"
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
            />
          </div>

          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light">
              <FiBell />
            </button>
            <button className="btn btn-light" onClick={toggleDarkMode}>
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Avatar"
              className="rounded-circle"
              width="35"
            />
          </div>
        </header>
        <div className="container-fluid  flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
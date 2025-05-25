import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'Nguyễn Văn A',
      orderDate: '2025-05-18',
      total: 150000,
      status: 'Chờ Xử Lý',
      items: [{ id: 'PROD001', name: 'Cà Phê Phin Đặc Biệt', quantity: 2, price: 75000 }],
    },
    {
      id: 'ORD002',
      customerName: 'Trần Thị B',
      orderDate: '2025-05-17',
      total: 220000,
      status: 'Đang Giao',
      items: [
        { id: 'PROD002', name: 'Cà Phê Latte Mật Ong', quantity: 1, price: 90000 },
        { id: 'PROD003', name: 'Cà Phê Gói Cao Cấp', quantity: 1, price: 120000 },
      ],
    },
    {
      id: 'ORD003',
      customerName: 'Lê Văn C',
      orderDate: '2025-05-16',
      total: 180000,
      status: 'Hoàn Thành',
      items: [
        { id: 'PROD004', name: 'Cà Phê Đen Đá', quantity: 2, price: 65000 },
        { id: 'PROD001', name: 'Cà Phê Phin Đặc Biệt', quantity: 1, price: 75000 },
      ],
    },
    {
      id: 'ORD004',
      customerName: 'Phạm Thị D',
      orderDate: '2025-05-15',
      total: 300000,
      status: 'Đã Hủy',
      items: [
        { id: 'PROD005', name: 'Cà Phê Cappuccino', quantity: 2, price: 85000 },
        { id: 'PROD006', name: 'Cà Phê Gói Tiêu Chuẩn', quantity: 1, price: 90000 },
      ],
    },
    {
      id: 'ORD005',
      customerName: 'Hoàng Văn E',
      orderDate: '2025-05-14',
      total: 250000,
      status: 'Chờ Xử Lý',
      items: [
        { id: 'PROD002', name: 'Cà Phê Latte Mật Ong', quantity: 1, price: 90000 },
        { id: 'PROD003', name: 'Cà Phê Gói Cao Cấp', quantity: 1, price: 120000 },
      ],
    },
    {
      id: 'ORD006',
      customerName: 'Ngô Thị F',
      orderDate: '2025-05-13',
      total: 190000,
      status: 'Hoàn Thành',
      items: [
        { id: 'PROD004', name: 'Cà Phê Đen Đá', quantity: 1, price: 65000 },
        { id: 'PROD005', name: 'Cà Phê Cappuccino', quantity: 1, price: 85000 },
      ],
    },
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // Thay bằng tab active
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let result = [...orders];

    // Tìm kiếm theo tên khách hàng hoặc mã đơn hàng
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo tab (Chờ Xử Lý, Hoàn Thành, hoặc tất cả)
    if (filterStatus === 'Chờ Xử Lý' || filterStatus === 'Hoàn Thành') {
      result = result.filter((order) => order.status === filterStatus);
    } else if (filterStatus !== '') {
      result = result.filter((order) => order.status !== 'Hoàn Thành');
    }

    // Sắp xếp
    if (sortOption) {
      result.sort((a, b) => {
        if (sortOption === 'total-asc') return a.total - b.total;
        if (sortOption === 'total-desc') return b.total - a.total;
        if (sortOption === 'date-asc') return new Date(a.orderDate) - new Date(b.orderDate);
        if (sortOption === 'date-desc') return new Date(b.orderDate) - new Date(a.orderDate);
        return 0;
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortOption, orders]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterStatus(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      setOrders(orders.filter((order) => order.id !== orderId));
    }
  };

  const handleConfirmOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId && order.status === 'Chờ Xử Lý'
          ? { ...order, status: 'Đang Giao' }
          : order
      )
    );
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="manage-orders-page">
      <div className="container">
        <h4 className="admin-page-title text-center mb-3">Quản Lý Đơn Hàng</h4>
        <div className="mb-3">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="Chờ Xử Lý">Đơn hàng chờ xác nhận</option>
                <option value="Hoàn Thành">Đơn hàng đã hoàn thành</option>
              </select>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={sortOption} onChange={handleSortChange}>
                <option value="">Sắp xếp</option>
                <option value="total-asc">Tổng tiền: Tăng dần</option>
                <option value="total-desc">Tổng tiền: Giảm dần</option>
                <option value="date-asc">Ngày đặt: Tăng dần</option>
                <option value="date-desc">Ngày đặt: Giảm dần</option>
              </select>
            </div>
          </div>
        </div>
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Mã Đơn Hàng</th>
                  <th>Tên Khách Hàng</th>
                  <th>Ngày Đặt</th>
                  <th>Tổng Tiền (VNĐ)</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.total.toLocaleString('vi-VN')}</td>
                    <td>
                      <span className={`status-badge status-${order.status.replace(/\s/g, '-')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-custom me-2"
                        onClick={() => handleViewDetails(order)}
                        data-bs-toggle="modal"
                        data-bs-target="#orderDetailsModal"
                      >
                        Xem Chi Tiết
                      </button>
                      <Link
                        to={`/admin/orders/edit/${order.id}`}
                        className="btn btn-outline-custom me-2"
                      >
                        Sửa
                      </Link>
                      {order.status === 'Chờ Xử Lý' && (
                        <button
                          className="btn btn-success me-2"
                          onClick={() => handleConfirmOrder(order.id)}
                        >
                          Xác Nhận
                        </button>
                      )}
                      {order.status === 'Chờ Xử Lý' && (
                        <button
                          className="btn btn-danger-custom"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          Xóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mt-4 pagination-custom">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(number)}>
                    {number}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Modal Chi Tiết Đơn Hàng */}
        <div
          className="modal fade"
          id="orderDetailsModal"
          tabIndex="-1"
          aria-labelledby="orderDetailsModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {selectedOrder ? (
                <>
                  <div className="modal-header">
                    <h5 className="modal-title" id="orderDetailsModalLabel">
                      Chi Tiết Đơn Hàng {selectedOrder.id}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={handleCloseModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Tên Khách Hàng:</strong> {selectedOrder.customerName}
                        </p>
                        <p>
                          <strong>Ngày Đặt:</strong> {selectedOrder.orderDate}
                        </p>
                        <p>
                          <strong>Tổng Tiền:</strong>{' '}
                          {selectedOrder.total.toLocaleString('vi-VN')} VNĐ
                        </p>
                        <p>
                          <strong>Trạng Thái:</strong>{' '}
                          <span
                            className={`status-badge status-${selectedOrder.status.replace(
                              /\s/g,
                              '-'
                            )}`}
                          >
                            {selectedOrder.status}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>Danh Sách Sản Phẩm</h6>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Tên Sản Phẩm</th>
                              <th>Số Lượng</th>
                              <th>Giá (VNĐ)</th>
                              <th>Thành Tiền (VNĐ)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price.toLocaleString('vi-VN')}</td>
                                <td>{(item.quantity * item.price).toLocaleString('vi-VN')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={handleCloseModal}
                    >
                      Đóng
                    </button>
                  </div>
                </>
              ) : (
                <div className="modal-body text-center p-5">Đang tải...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
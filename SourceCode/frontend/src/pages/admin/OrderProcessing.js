import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FiCheck, FiX } from "react-icons/fi";

const OrderProcessing = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customerName: "Nguyễn Văn A",
      orderDate: "2025-05-18",
      total: 150000,
      status: "Chờ Xử Lý",
      items: [
        { id: "PROD001", name: "Cà Phê Phin Đặc Biệt", quantity: 2, price: 75000 },
      ],
    },
    {
      id: "ORD002",
      customerName: "Trần Thị B",
      orderDate: "2025-05-17",
      total: 220000,
      status: "Chờ Xử Lý",
      items: [
        { id: "PROD002", name: "Cà Phê Latte Mật Ong", quantity: 1, price: 90000 },
        { id: "PROD003", name: "Cà Phê Gói Cao Cấp", quantity: 1, price: 120000 },
      ],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState(null);

  const pendingOrders = orders.filter(order => order.status === "Chờ Xử Lý");

  const handleAction = (order, action) => {
    setSelectedOrder(order);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (actionType === "confirm") {
      setOrders(orders.map(order =>
        order.id === selectedOrder.id ? { ...order, status: "Đã Xác Nhận" } : order
      ));
    } else if (actionType === "cancel") {
      setOrders(orders.map(order =>
        order.id === selectedOrder.id ? { ...order, status: "Đã Hủy" } : order
      ));
    }
    setShowModal(false);
    setSelectedOrder(null);
    setActionType(null);
  };

  return (
    <div className="order-processing-page py-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-center text-primary-brown mb-5">
          Xử Lý Đơn Hàng
        </h2>

        {pendingOrders.length === 0 ? (
          <div className="text-center py-5 text-muted">
            Không có đơn hàng nào chờ xử lý.
          </div>
        ) : (
          <div className="table-container">
            <div className="table-responsive rounded shadow-sm">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Mã Đơn Hàng</th>
                    <th>Khách Hàng</th>
                    <th>Ngày Đặt</th>
                    <th>Tổng Tiền (VNĐ)</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.orderDate}</td>
                      <td>{order.total.toLocaleString("vi-VN")}</td>
                      <td>
                        <span className="status-badge bg-warning text-dark">
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-success me-2 d-flex align-items-center"
                          onClick={() => handleAction(order, "confirm")}
                        >
                          <FiCheck className="me-1" /> Xác Nhận
                        </button>
                        <button
                          className="btn btn-danger d-flex align-items-center"
                          onClick={() => handleAction(order, "cancel")}
                        >
                          <FiX className="me-1" /> Hủy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác Nhận Hành Động</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <p>
                Bạn có chắc chắn muốn{" "}
                {actionType === "confirm" ? "xác nhận" : "hủy"} đơn hàng{" "}
                <strong>{selectedOrder.id}</strong> của khách hàng{" "}
                <strong>{selectedOrder.customerName}</strong> không?
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={confirmAction}
              className="btn-custom"
            >
              Xác Nhận
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default OrderProcessing;
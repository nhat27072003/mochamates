import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Button as BSButton, Tabs, Tab } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/helpers";
import { getOrdersByStatus, getRecentOrders } from "../../services/OrderService";
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState("allOrders");

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "allOrders") {
      fetchOrdersByStatus();
    } else {
      fetchRecentOrders();
    }
  }, [activeTab, page, size, filterStatus]);

  const fetchOrdersByStatus = async () => {
    try {
      setLoading(true);
      const response = await getOrdersByStatus(
        filterStatus !== "all" ? filterStatus.toUpperCase() : "all",
        page,
        size,
        "id,desc"
      );
      setOrders(response.orders || []);
      setPage(response.currentPage);
      setSize(size);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error("Error fetching orders: " + (error.response?.data?.message || error.message));
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      const response = await getRecentOrders(5);
      setRecentOrders(response || []);
      setTotalPages(1); // No pagination for recent orders
    } catch (error) {
      toast.error("Error fetching recent orders: " + (error.response?.data?.message || error.message));
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "pending";
      case "confirmed":
        return "confirmed";
      case "processing":
        return "processing";
      case "shipped":
        return "shipped";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "";
    }
  };

  const renderOrderTable = (orderList) => (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orderList.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td>
              {order.items.map((item, index) => (
                <div key={index} className="item-container d-flex align-items-center">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"}
                    alt={item.name}
                    style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}
                    onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd")}
                  />
                  <span>{item.name} (x{item.quantity})</span>
                </div>
              ))}
            </td>
            <td>{formatPrice(order.total)}</td>
            <td>
              <span className={`status-badge ${getStatusColor(order.status)}`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </td>
            <td>
              <BSButton
                variant="link"
                className="action-btn"
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                View Details
              </BSButton>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  if (loading) {
    return (
      <div className="loading text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-order-management p-4">
      <Container fluid>
        <div className="header mb-1">
          <h4 className="d-flex align-items-center">
            <i className="bi bi-cart-check me-2"></i> Manage Orders
          </h4>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-2"
        >
          <Tab eventKey="allOrders" title="All Orders">
            <div className="search-filter mb-2">
              <Row className="g-3">
                <Col md={4}>
                  <div className="search-input position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Search orders by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon position-absolute" style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }} />
                  </div>
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="status-filter"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="From Date"
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="To Date"
                  />
                </Col>
              </Row>
            </div>

            {orders.length === 0 ? (
              <div className="no-orders text-center p-5">
                <h2>No Orders Found</h2>
                <p>No orders match the current filters.</p>
              </div>
            ) : (
              <div className="table-container">
                {renderOrderTable(orders)}

                <div className="pagination d-flex justify-content-center align-items-center mt-4">
                  <BSButton
                    variant="outline-primary"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="me-3"
                  >
                    Previous
                  </BSButton>
                  <span className="mx-3">
                    Page {page + 1} of {totalPages}
                  </span>
                  <BSButton
                    variant="outline-primary"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={page === totalPages - 1}
                    className="ms-3"
                  >
                    Next
                  </BSButton>
                  <Form.Select
                    value={size}
                    onChange={(e) => {
                      setSize(parseInt(e.target.value));
                      setPage(0); // Reset to first page on size change
                    }}
                    className="ms-3"
                    style={{ width: "100px" }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </Form.Select>
                </div>
              </div>
            )}
          </Tab>

          <Tab eventKey="recentOrders" title="Recent Orders">
            {recentOrders.length === 0 ? (
              <div className="no-orders text-center p-5">
                <h2>No Recent Orders</h2>
                <p>No recent orders available.</p>
              </div>
            ) : (
              <div className="table-container">
                {renderOrderTable(recentOrders)}
              </div>
            )}
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default ManageOrders;
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Button as BSButton } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllOrders } from "../../services/OrderService";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page, size, searchTerm, filterStatus, dateFrom, dateTo]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size,
        sort: "id,desc",
        q: searchTerm,
        status: filterStatus !== "all" ? filterStatus : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };
      const response = await getAllOrders(params);
      const { content, page: pageNumber, size: pageSize, totalPages } = response.data;
      setOrders(content);
      setPage(pageNumber);
      setSize(pageSize);
      setTotalPages(totalPages);
    } catch (error) {
      toast.error("Error fetching orders: " + (error.response?.data?.message || error.message));
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "pending";
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-order-management">
      <Container fluid>
        <div className="header">
          <h4>Manage Orders</h4>
          <div className="search-filter">
            <div className="search-input col-4">
              <Form.Control
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter col-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
            <Form.Control
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="date-filter col-2"
              placeholder="From Date"
            />
            <Form.Control
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="date-filter col-2"
              placeholder="To Date"
            />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No Orders Found</h2>
            <p>No orders match the current filters.</p>
          </div>
        ) : (
          <div className="table-container">
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index} className="item-container">
                          <img
                            src={item.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"}
                            alt={item.name}
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd")}
                          />
                          <span>{item.name} (x{item.quantity})</span>
                        </div>
                      ))}
                    </td>
                    <td>${order.total?.toFixed(2) || "0.00"}</td>
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

            <div className="pagination d-flex justify-content-center mt-3">
              <BSButton
                variant="outline-primary"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </BSButton>
              <span className="mx-3 align-self-center">
                Page {page + 1} of {totalPages}
              </span>
              <BSButton
                variant="outline-primary"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </BSButton>
              <Form.Select
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
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
      </Container>
    </div>
  );
};

export default ManageOrders;
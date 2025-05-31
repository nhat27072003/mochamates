import React, { useState, useEffect } from 'react';
import { FaSearch, FaTable, FaThLarge, FaTimes } from 'react-icons/fa';
import { Container, Row, Col, Table, Form, Modal } from 'react-bootstrap';
import { getOrdersForUser } from '../../../services/OrderService';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import { formatPrice } from '../../../utils/helpers';

const OrdersPage = () => {
  const [viewMode, setViewMode] = useState('table');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrdersForUser();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const OrderModal = ({ order, onClose }) => (
    <Modal show={true} onHide={onClose} centered className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Order Details</h3>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <div>
              <p className="font-weight-bold">Order ID:</p>
              <p>{order.id}</p>
            </div>
            <div>
              <p className="font-weight-bold">Order Date:</p>
              <p>{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div>
            <p className="font-weight-bold">Shipping Address:</p>
            <p>{order.address || 'N/A'}</p>
          </div>
          <div>
            <p className="font-weight-bold">Items:</p>
            {order.items.map((item, index) => (
              <div key={index} className="item-container">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'}
                  alt={item.name}
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'}
                />
                <div>
                  <p>{item.name}</p>
                  <p className="text-muted">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="font-weight-bold">Tracking Information:</p>
            <p>{order.tracking || 'N/A'}</p>
          </div>
          <div>
            <p className="font-weight-bold">Total Amount:</p>
            <p className="text-primary-brown">${order.total?.toFixed(2) || '0.00'}</p>
          </div>
          {order.status.toLowerCase() === 'delivered' && (
            <div>
              <p className="font-weight-bold">Write a Review:</p>
              {order.items.map((item, index) => (
                <Button
                  key={index}
                  variant="link"
                  className="action-btn"
                  onClick={() => {
                    window.location.href = `/products/${item.productId}/review?orderId=${order.id}`;
                  }}
                >
                  Review {item.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }
  return (
    <div className="orders-page">
      <Container fluid>
        <div className="header">
          <h4>My Orders</h4>
          <div className="search-filter">
            <div className="search-input col-5">
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
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
            <div className="view-toggle">
              <button
                className={`btn me-1 ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                <FaTable />
              </button>
              <button
                className={`btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FaThLarge />
              </button>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <div className="table-container">
                <Table responsive>
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
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <div className='items-column'>
                          {order.items.map((item, index) => (
                            <div key={index} className="item-container">
                              <img
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'}
                                alt={item.name}
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'}
                              />
                              <span>{item.name} (x{item.quantity})</span>
                            </div>
                          ))}
                        </div>

                        <td>{formatPrice(order.total)}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="link"
                            className="action-btn"
                            onClick={() => {
                              navigate(`/order/${order.id}`);
                            }}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="grid-container">
                <Row>
                  {filteredOrders.map((order) => (
                    <Col xs={12} md={6} lg={4} key={order.id}>
                      <div className="order-card">
                        <div className="order-header">
                          <div>
                            <h3 className="order-id">{order.id}</h3>
                            <p className="text-muted">{formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`status-badge ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="items-wrapper">
                          {order.items.map((item, index) => (
                            <div key={index} className="item-container">
                              <img
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'}
                                alt={item.name}
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'}
                              />
                              <div>
                                <p>{item.name}</p>
                                <p className="text-muted">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="order-footer">
                          <span className="total">{formatPrice(order.total)}</span>
                          <Button
                            className="action-btn"
                            onClick={() => {
                              navigate(`/order/${order.id}`);
                            }}
                          >
                            View Details
                          </Button>

                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

          </>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
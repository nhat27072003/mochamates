import React, { useState } from "react";
import { Container, Row, Col, Table, Form, Modal, Button as BSButton } from "react-bootstrap";
import { FiPrinter, FiDownload, FiCopy } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const OrderDetail = () => {
  const [orderStatus, setOrderStatus] = useState("pending");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const dummyOrder = {
    id: "ORD-2024-001",
    customer: {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Downtown District, Ward 5, 12345"
    },
    payment: {
      method: "Credit Card",
      cardNumber: "**** **** **** 4789",
      expiryDate: "12/25"
    },
    products: [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        quantity: 2,
        price: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      },
      {
        id: 2,
        name: "Smart Watch Pro",
        quantity: 1,
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
      }
    ],
    summary: {
      subtotal: 699.97,
      shipping: 15.00,
      discount: 50.00,
      total: 664.97
    },
    timestamps: {
      created: new Date("2024-01-15T10:30:00"),
      updated: new Date("2024-01-15T14:45:00"),
      delivered: null
    }
  };

  const handleStatusChange = (newStatus) => {
    setShowConfirmation(true);
  };

  const confirmStatusUpdate = () => {
    setOrderStatus(document.getElementById("statusSelect").value);
    setShowConfirmation(false);
  };

  return (
    <div className="order-details">
      <Container fluid>
        {/* Header Section */}
        <div className="header bg-gradient-to-r from-primary-brown to-primary-green p-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="text-white text-2xl font-bold">Order Details #{dummyOrder.id}</h1>
            </Col>
            <Col className="text-end">
              <div className="action-buttons">
                <BSButton variant="link" className="text-white hover:text-accent-orange transition">
                  <FiPrinter className="w-6 h-6" title="Print" />
                </BSButton>
                <BSButton variant="link" className="text-white hover:text-accent-orange transition">
                  <FiDownload className="w-6 h-6" title="Download PDF" />
                </BSButton>
                <BSButton variant="link" className="text-white hover:text-accent-orange transition">
                  <FiCopy className="w-6 h-6" title="Copy Order ID" />
                </BSButton>
              </div>
            </Col>
          </Row>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="card bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <Row className="g-4">
              <Col md={6}>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{dummyOrder.customer.name}</p>
              </Col>
              <Col md={6}>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{dummyOrder.customer.phone}</p>
              </Col>
              <Col md={12}>
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{dummyOrder.customer.address}</p>
              </Col>
            </Row>
          </div>

          {/* Payment Information */}
          <div className="card bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <Row className="g-4">
              <Col md={6}>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium">{dummyOrder.payment.method}</p>
              </Col>
              <Col md={6}>
                <p className="text-gray-600">Card Number</p>
                <p className="font-medium">{dummyOrder.payment.cardNumber}</p>
              </Col>
            </Row>
          </div>

          {/* Product List */}
          <div className="card bg-gray-50 p-4 rounded-lg">
            <Table responsive striped bordered hover>
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dummyOrder.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover"
                          loading="lazy"
                        />
                        <span className="ml-3">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">{product.quantity}</td>
                    <td className="px-4 py-2 text-right">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">
                      ${(product.quantity * product.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Order Summary */}
          <div className="card bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <Row className="g-2">
              <Col>
                <div className="d-flex justify-content-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${dummyOrder.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${dummyOrder.summary.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-gray-600">Discount</span>
                  <span>-${dummyOrder.summary.discount.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary-brown">${dummyOrder.summary.total.toFixed(2)}</span>
                </div>
              </Col>
            </Row>
          </div>

          {/* Order Status */}
          <div className="card bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            <Row className="g-4">
              <Col md={6}>
                <Form.Label className="text-sm font-medium text-gray-700 mb-2">Current Status</Form.Label>
                <Form.Select
                  id="statusSelect"
                  className="w-100 p-2 border border-gray-300 rounded-md"
                  value={orderStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <p className="text-sm font-medium text-gray-700 mb-2">Timestamps</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    Created: {(dummyOrder.timestamps.created, "PPpp")}
                  </p>
                  <p className="text-sm">
                    Last Updated: {(dummyOrder.timestamps.updated, "PPpp")}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>

      {/* Status Update Confirmation Modal */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 mb-4">Are you sure you want to update the order status?</p>
        </Modal.Body>
        <Modal.Footer>
          <BSButton variant="secondary" onClick={() => setShowConfirmation(false)}>
            Cancel
          </BSButton>
          <BSButton variant="primary" onClick={confirmStatusUpdate}>
            Confirm
          </BSButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderDetail;
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Modal, Button as BSButton } from "react-bootstrap";
import { FiPrinter, FiDownload, FiCopy } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrder, updateOrderStatusForAdmin } from "../../services/OrderService";
import { formatPrice } from "../../utils/helpers";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      console.log("check order id", id);
      const response = await getOrder(id);
      console.log("check order", response);
      setOrder(response.data);
      setOrderStatus(response.data.status);
      setNewStatus(response.data.status);
    } catch (error) {
      toast.error("Error fetching order details: " + (error.response?.data?.message || error.message));
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value) => {
    setNewStatus(value);
    setShowConfirmation(true);
  };

  const confirmStatusUpdate = async () => {
    try {
      console.log("check update ", newStatus);
      const result = await updateOrderStatusForAdmin(id, { status: newStatus });
      console.log("check update ", result);
      setOrderStatus(newStatus);
      toast.success("Order status updated successfully!");
      fetchOrderDetails();
      setShowConfirmation(false);
    } catch (error) {
      console.log(error);
      toast.error("Error updating order status: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="no-orders">
        <h2>Order Not Found</h2>
        <p>The requested order could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 py-4" style={{ backgroundColor: "#f8f9fc" }}>
      <div className="card card-style order-details">
        {/* Header Section */}
        <div className="card-header gradient-bg p-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 text-white mb-0">Order Details #{order.id}</h1>
            <div className="d-flex gap-3">
              <button className="btn btn-icon text-white hover-effect" title="Print">
                <FiPrinter size={24} />
              </button>
              <button className="btn btn-icon text-white hover-effect" title="Download PDF">
                <FiDownload size={24} />
              </button>
              <button className="btn btn-icon text-white hover-effect" title="Copy Order ID">
                <FiCopy size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card-body p-4">
          {/* Order Status */}
          <div className="card card-style mb-2">
            <div className="card-body p-4">
              <h2 className="h5 mb-4">Order Status</h2>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-gray-600">Current Status</label>
                  <p className="fw-medium mb-2">{orderStatus}</p>
                  <div className="d-flex gap-2">
                    {orderStatus === "PENDING" && (
                      <>
                        <BSButton
                          variant="primary"
                          onClick={() => handleStatusChange("CONFIRMED")}
                          className="me-2"
                        >
                          Confirmed
                        </BSButton>
                        <BSButton
                          variant="danger"
                          onClick={() => handleStatusChange("CANCELLED")}
                        >
                          Cancelled
                        </BSButton>
                      </>
                    )}
                    {orderStatus === "CONFIRMED" && (
                      <BSButton
                        variant="primary"
                        onClick={() => handleStatusChange("SHIPPED")}
                      >
                        Shipped
                      </BSButton>
                    )}
                    {orderStatus === "SHIPPED" && (
                      <BSButton
                        variant="primary"
                        onClick={() => handleStatusChange("DELIVERED")}
                      >
                        Delivered
                      </BSButton>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <p className="text-gray-600 mb-2">Timestamps</p>
                  <div>
                    <p className="mb-1">
                      Created: {new Date(order.createAt).toLocaleString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mb-1">
                      Last Updated: {new Date(order.updatedAt).toLocaleString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Customer Information */}
          <div className="card card-style mb-2">
            <div className="card-body p-3">
              <h2 className="h5 mb-2">Customer Information</h2>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <p className="text-gray-600">Name</p>
                  <p className="fw-medium">{order.fullName}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="text-gray-600">Phone</p>
                  <p className="fw-medium">{order.phoneNumber}</p>
                </div>
                <div className="col-12">
                  <p className="text-gray-600">Address</p>
                  <p className="fw-medium">{order.streetAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="card card-style mb-2">
            <div className="card-body p-3">
              <h2 className="h5 mb-2">Payment Information</h2>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <p className="text-gray-600">Payment Method</p>
                  <p className="fw-medium">{order.paymentMethod}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="text-gray-600">Card Number</p>
                  <p className="fw-medium">{order.cardNumber || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="table-responsive mb-2">
            <table className="table table-hover">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-start text-gray-600">Product</th>
                  <th scope="col" className="px-4 py-3 text-end text-gray-600">Quantity</th>
                  <th scope="col" className="px-4 py-3 text-end text-gray-600">Price</th>
                  <th scope="col" className="px-4 py-3 text-end text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={product.imageUrl || "https://via.placeholder.com/48"}
                          alt={product.name}
                          className="rounded me-3"
                          style={{ width: "48px", height: "48px", objectFit: "cover" }}
                          loading="lazy"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/48")}
                        />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">{product.quantity}</td>
                    <td className="px-4 py-3 text-end">{formatPrice(product.price.toFixed(2))}</td>
                    <td className="px-4 py-3 text-end">{formatPrice(product.totalPrice.toFixed(2))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="card card-style mb-2">
            <div className="card-body p-3">
              <h2 className="h5 mb-2">Order Summary</h2>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-gray-600">Discount</span>
                <span>-{formatPrice(0)}</span>
              </div>
              <div className="d-flex justify-content-between pt-3 border-top">
                <span className="fw-semibold">Total</span>
                <span className="fw-semibold text-primary-brown">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Confirmation Modal */}
      {showConfirmation && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card-style">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Update</h5>
              </div>
              <div className="modal-body">
                <p className="text-gray-600">Are you sure you want to update the order status to {newStatus}?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary-brown"
                  onClick={confirmStatusUpdate}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
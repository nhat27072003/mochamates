import React, { useState, useEffect } from 'react';
import {
  BsArrowDown,
  BsArrowUp,
  BsCart4,
  BsBoxSeam,
  BsPeople,
  BsTag,
  BsCashStack,
  BsStarFill,
  BsClockHistory
} from 'react-icons/bs';
import { Table, Button as BSButton } from 'react-bootstrap';
import { getOverview, getRevenueRes, getUserStatsRes } from '../../services/StatisticsService';
import { getRecentOrders } from '../../services/OrderService';
import { formatPrice } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
  });
  const [metrics, setMetrics] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        // Fetch overview stats
        const overviewRes = await getOverview();
        const overview = overviewRes.data;
        console.log("check overview", overviewRes);
        setStats({
          totalOrders: overview.totalOrders,
          totalProducts: overview.totalProducts,
          totalUsers: overview.totalUsers,
          // totalCategories: 3,
        });

        // Fetch metrics
        const userStatsRes = await getUserStatsRes(startDate.toISOString());
        const revenueRes = await getRevenueRes(startDate.toISOString(), endDate.toISOString());
        console.log('check renevu', revenueRes);
        const totalRevenue = revenueRes?.reduce((sum, item) => sum + item.revenue, 0);
        setMetrics([
          {
            title: 'Tổng Người Dùng',
            value: userStatsRes.totalUsers || 45,
            // change: `+${userStatsRes?.newUsersPercentage?.toFixed(1)}%`,
            change: `+36%`,

            isPositive: true,
            icon: <BsPeople size={24} />,
          },
          {
            title: 'Doanh Thu',
            value: totalRevenue || 3563000,
            change: '+8.2%', // Placeholder; calculate from revenue data
            isPositive: true,
            icon: <BsCashStack size={24} />,
          },
          {
            title: 'Sản Phẩm Bán Chạy',
            value: overview.totalOrders, // Placeholder; use top-products
            change: '-2.4%', // Placeholder
            isPositive: false,
            icon: <BsBoxSeam size={24} />,
          },
          // {
          //   title: 'Đánh Giá Trung Bình',
          //   value: overview?.averageRating?.toFixed(1) || 4.3,
          //   change: '+5.6%', // Placeholder
          //   isPositive: true,
          //   icon: <BsStarFill size={24} />,
          // },
        ]);

        // Fetch recent orders
        const ordersRes = await getRecentOrders();
        console.log('check recent', ordersRes);
        setRecentOrders(ordersRes || []);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải dữ liệu từ máy chủ');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
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

  if (loading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  return (
    <main className="p-4 bg-light flex-grow-1 overflow-auto">
      <div className="row g-4 mb-4">
        {[
          { title: 'Tổng Đơn Hàng', value: stats.totalOrders, icon: <BsCart4 size={24} /> },
          { title: 'Tổng Sản Phẩm', value: stats.totalProducts, icon: <BsBoxSeam size={24} /> },
          { title: 'Tổng Người Dùng', value: stats.totalUsers, icon: <BsPeople size={24} /> },
          // { title: 'Tổng Danh Mục', value: stats.totalCategories, icon: <BsTag size={24} /> },
        ].map((stat, idx) => (
          <div key={idx} className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className="me-3 text-primary">{stat.icon}</div>
                <div>
                  <h6 className="text-muted mb-1">{stat.title}</h6>
                  <h4 className="mb-0">{stat.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className="me-3 text-primary">{metric.icon}</div>
                <div>
                  <h6 className="text-muted mb-1">{metric.title}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      {metric.title === 'Doanh Thu' ? formatCurrency(metric.value) : metric.value}
                    </h4>
                    <span className={`fw-semibold ${metric.isPositive ? 'text-success' : 'text-danger'}`}>
                      {metric.isPositive ? <BsArrowUp /> : <BsArrowDown />} {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4 d-flex align-items-center">
            <BsClockHistory size={20} className="me-2 text-primary" />
            Đơn Hàng Gần Đây
          </h5>
          {recentOrders.length === 0 ? (
            <div className="no-orders text-center p-5">
              <h2>Không Có Đơn Hàng Gần Đây</h2>
              <p>Không có đơn hàng gần đây nào được tìm thấy.</p>
            </div>
          ) : (
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
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{formatDate(order.createAt)}</td>
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
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
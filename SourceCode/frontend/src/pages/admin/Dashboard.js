import React from 'react';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = {
    totalOrders: 150,
    totalProducts: 30,
    totalUsers: 200,
    totalCategories: 5,
  };
  const metrics = [
    { title: "Total Users", value: "24,563", change: "+12.5%", isPositive: true },
    { title: "Revenue", value: "$86,247", change: "+8.2%", isPositive: true },
    { title: "Active Projects", value: "156", change: "-2.4%", isPositive: false },
    { title: "Pending Tasks", value: "38", change: "+5.6%", isPositive: true }
  ];

  const recentOrders = [
    {
      customer: "Nguyễn Văn A",
      action: "Đã đặt đơn hàng",
      timestamp: "2 giờ trước",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      customer: "Trần Thị B",
      action: "Đã đặt đơn hàng",
      timestamp: "4 giờ trước",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    {
      customer: "Lê Văn C",
      action: "Đã đặt đơn hàng",
      timestamp: "6 giờ trước",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    }
  ];

  return (
    <main className="p-4 bg-light flex-grow-1 overflow-auto">
      <div className="row g-4 mb-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="col-md-6 col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">{metric.title}</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <h4>{metric.value}</h4>
                  <span className={`fw-semibold ${metric.isPositive ? "text-success" : "text-danger"}`}>
                    {metric.isPositive ? <BsArrowUp /> : <BsArrowDown />} {metric.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Đơn hàng gần đây vừa đặt</h5>
          <ul className="list-group list-group-flush">
            {recentOrders.map((order, idx) => (
              <li key={idx} className="list-group-item d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img src={order.avatar} alt={order.customer} className="rounded-circle me-3" width="40" />
                  <div>
                    <div className="fw-semibold">{order.customer}</div>
                    <small className="text-muted">{order.action}</small>
                  </div>
                </div>
                <small className="text-muted">{order.timestamp}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
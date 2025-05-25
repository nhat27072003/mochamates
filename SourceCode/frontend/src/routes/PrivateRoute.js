// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, currentUser } = useSelector((state) => state.user);

  // Chưa đăng nhập
  // if (!isAuthenticated || !currentUser) {
  //   return <Navigate to="/signin" replace />;
  // }

  // // Không có quyền
  // if (
  //   allowedRoles.length > 0 &&
  //   !allowedRoles.includes(currentUser.user.role)
  // ) {
  //   console.log('khong co role')
  //   console.log('currentUser', currentUser)
  //   return <Navigate to="/" replace />;
  // }

  // Được phép
  return <Outlet />;
};

export default PrivateRoute;

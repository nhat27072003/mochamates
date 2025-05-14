import React, { useState } from 'react';
import './VerifyOTP.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getVerifyOTP, login, verifyOTP } from '../../services/AuthService';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { usernameOrEmail } = location.state || {};

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail) {
      setErrorMessage('Không tìm thấy thông tin người dùng. Vui lòng thử lại.');
      return;
    }
    try {
      const result = await verifyOTP({ usernameOrEmail, otp });
      console.log('Xác thực OTP thành công:', result);
      setErrorMessage('');
      navigate('/');
    } catch (error) {
      console.log(error);
      setErrorMessage('Mã xác thực không đúng. Vui lòng thử lại.');
    }
  };

  const handleResendOTP = async () => {
    if (!usernameOrEmail) {
      setErrorMessage('Không tìm thấy thông tin người dùng. Vui lòng thử lại.');
      return;
    }
    try {
      await getVerifyOTP({ usernameOrEmail });
      setErrorMessage('Mã xác thực mới đã được gửi đến email của bạn.');
    } catch (error) {
      setErrorMessage('Không thể gửi lại mã xác thực. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center verify-otp-bg">
      <div className="verify-otp-card card shadow-lg w-100" style={{ maxWidth: '480px' }}>
        <div className="card-body">
          <div className="text-end mb-3">
            <a href="/" className="btn btn-outline-custom text-decoration-none">
              Quay Về Trang Chủ
            </a>
          </div>
          <div className="text-center">
            <h1 className="card-title h3">Xác Thực Email</h1>
            <p className="card-text text-muted">
              Vui lòng nhập mã xác thực đã gửi đến email của bạn
            </p>
          </div>
          <div className="mt-3">
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-4">
                <label htmlFor="otp" className="form-label text-muted">
                  Mã Xác Thực
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  placeholder="Nhập mã xác thực"
                  value={otp}
                  onChange={handleOTPChange}
                  required
                />
              </div>
              {errorMessage && (
                <p className="text-danger text-center mb-3">{errorMessage}</p>
              )}
              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-dark btn-lg verify-btn-custom">
                  Xác Nhận
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  onClick={handleResendOTP}
                >
                  Gửi lại mã
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
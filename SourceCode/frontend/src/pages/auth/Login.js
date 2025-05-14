import React, { useState } from 'react';
import './Login.css';
import { getVerifyOTP, login } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formLogin, setFormLogin] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formLogin);
      console.log('check login result ', result);
      if (result?.statusCode === '1000') {
        console.log('come here')
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400 && error?.response?.data?.statusCode === '1006') {
        try {
          getVerifyOTP({ usernameOrEmail: formLogin.usernameOrEmail });
          navigate('/verify-otp', { state: { usernameOrEmail: formLogin.usernameOrEmail } });
        } catch (err) {
          console.log(err)
        }
      } else {
        setErrorMessage('Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
      }
    }
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center login-bg">
      <div className="login-card card shadow-lg w-100" style={{ maxWidth: '480px' }}>
        <div className="card-body">
          <div className="text-end mb-3">
            <a href="/" className="btn btn-outline-custom text-decoration-none">
              Quay Về Trang Chủ
            </a>
          </div>
          <div className="text-center">
            <h1 className="card-title h3">Đăng Nhập</h1>
            <p className="card-text text-muted">Chào mừng bạn quay trở lại</p>
          </div>
          <div className="mt-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="usernameOrEmail" className="form-label text-muted">
                  Email hoặc Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="usernameOrEmail"
                  placeholder="Email hoặc Username"
                  name="usernameOrEmail"
                  value={formLogin.usernameOrEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label text-muted">Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Mật khẩu"
                  name="password"
                  value={formLogin.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {errorMessage && (
                <p className="text-danger text-center mb-3">{errorMessage}</p>
              )}
              <div className="d-grid">
                <button type="submit" className="btn btn-dark btn-lg login-btn-custom">
                  Đăng Nhập
                </button>
              </div>
              <p className="text-center text-muted mt-4">
                Bạn chưa có tài khoản?{' '}
                <a href="/register" className="text-decoration-none">
                  Đăng ký
                </a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
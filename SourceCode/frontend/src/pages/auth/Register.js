import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/AuthService';
import Button from '../../components/Button/Button';

const Register = () => {
  const [formRegister, setFormRegister] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formRegister.password !== formRegister.confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const result = await register({ username: formRegister.username, email: formRegister.email, password: formRegister.password });
      console.log('Đăng ký thành công:', result);
      if (result.statusCode === '1000') {
        navigate('/verify-otp', { state: { usernameOrEmail: formRegister.username || formRegister.email } });
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.statusCode === '1001')
        setErrorMessage(error?.response?.data?.message);
      else
        setErrorMessage('Đăng ký thất bại. Vui lòng kiểm tra thông tin hoặc thử lại sau.');
    }
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center register-bg">
      <div className="register-card card shadow-lg w-100" style={{ maxWidth: '480px' }}>
        <div className="card-body">
          <div className="text-end mb-2">
            <a href="/" className="btn btn-outline-custom text-decoration-none">
              Quay Về Trang Chủ
            </a>
          </div>
          <div className="text-center">
            <h1 className="card-title h3">Đăng Ký</h1>
            <p className="card-text text-muted">Tạo tài khoản mới để bắt đầu</p>
          </div>
          <div className="mt-2">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="username" className="form-label text-muted">Tên Người Dùng</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formRegister.username}
                  onChange={handleInputChange}
                  placeholder="Tên người dùng"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="email" className="form-label text-muted">Địa Chỉ Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formRegister.email}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ Email"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="password" className="form-label text-muted">Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formRegister.password}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu phải chứa kí tự và số"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="confirmPassword" className="form-label text-muted">Xác Nhận Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formRegister.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Xác nhận Mật khẩu"
                  required
                />
              </div>
              {errorMessage && <p className="text-danger text-center mb-2">{errorMessage}</p>}
              <div className="d-grid">
                <Button
                  type="submit"
                  variant="dark"
                  size="lg" // Thêm prop size để hỗ trợ btn-lg
                  className="register-btn-custom"
                >
                  Đăng Ký
                </Button>
              </div>
              <p className="text-center text-muted mt-4">
                Đã có tài khoản?{' '}
                <a href="/signin" className="text-decoration-none">
                  Đăng nhập
                </a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
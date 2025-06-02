import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, getVerifyOTP, resetError, loginSuccess } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Button from '../../components/Button/Button';
import { Alert, Form, Container, Card } from 'react-bootstrap';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);
  const [formLogin, setFormLogin] = useState({
    usernameOrEmail: '',
    password: '',
  });

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
      dispatch(resetError()); // Clear previous errors
      const result = await dispatch(login({
        usernameOrEmail: formLogin.usernameOrEmail,
        password: formLogin.password,
      })).unwrap();
      // result = { accessToken, userId, role }\
      const token = result.accessToken;
      const decoded = jwtDecode(token);
      console.log('check decode', decoded)

      dispatch(loginSuccess({
        token,
        user: {
          userId: result.userId,
          username: formLogin.usernameOrEmail,
          role: decoded.role,
        },
      }));
      if (decoded.role === "ADMIN") {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log("check erro", err)
      if (err === "User not verified by email verification code") { // Backend message for 1006
        try {
          await dispatch(getVerifyOTP({ usernameOrEmail: formLogin.usernameOrEmail })).unwrap();
          navigate('/verify-otp', { state: { usernameOrEmail: formLogin.usernameOrEmail } });
        } catch (otpError) {
          console.error('OTP request failed:', otpError);
        }
      }
      console.log(err)
    }
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center login-bg" style={{ minHeight: '100vh' }}>
      <Card className="login-card shadow-lg w-100" style={{ maxWidth: '480px' }}>
        <Card.Body>
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
            {error && (
              <Alert variant="danger" onClose={() => dispatch(resetError())} dismissible>
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="text-muted">Email hoặc Username</Form.Label>
                <Form.Control
                  type="text"
                  id="usernameOrEmail"
                  placeholder="Email hoặc Username"
                  name="usernameOrEmail"
                  value={formLogin.usernameOrEmail}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="text-muted">Mật Khẩu</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  placeholder="Mật khẩu"
                  name="password"
                  value={formLogin.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <div className="d-grid">
                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  className="login-btn-custom"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
                </Button>
              </div>
              <p className="text-center text-muted mt-4">
                Bạn chưa có tài khoản?{' '}
                <a href="/register" className="text-decoration-none">
                  Đăng ký
                </a>.
              </p>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
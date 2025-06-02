import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { changePassord } from '../../services/UserService';

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kiểm tra xác thực
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Bạn cần đăng nhập để đổi mật khẩu');
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Xóa lỗi khi người dùng nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation phía client
    if (!formData.oldPassword) {
      setError('Vui lòng nhập mật khẩu cũ');
      setLoading(false);
      return;
    }
    if (!formData.newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      setLoading(false);
      return;
    }
    if (formData.newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      setLoading(false);
      return;
    }

    try {
      const response = await changePassord(
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        });
      console.log('check change pass', response)
      toast.success('Đổi mật khẩu thành công!');
      setFormData({ oldPassword: '', newPassword: '' });
      navigate('/profile');
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <Container>
        <div className="header">
          <h4>Đổi Mật Khẩu</h4>
          <Button
            variant="outline-secondary"
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            Quay Lại
          </Button>
        </div>
        {error && <div className="alert alert-danger small">{error}</div>}
        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Đang xử lý...</p>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="oldPassword">
                  <Form.Label>Mật Khẩu Cũ</Form.Label>
                  <Form.Control
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu cũ"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>Mật Khẩu Mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Đang Đổi...' : 'Đổi Mật Khẩu'}
                </Button>
              </Form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ChangePasswordPage;
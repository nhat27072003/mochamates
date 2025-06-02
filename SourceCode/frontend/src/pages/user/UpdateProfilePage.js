import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile } from '../../services/UserService';

const UpdateProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Bạn cần đăng nhập để cập nhật hồ sơ');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        const userData = response.data;
        setFormData({
          email: userData.email || '',
          phone: userData.phone || '',
          fullName: userData.fullName || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || '',
          address: userData.address || '',
        });
        // Optionally update Redux store
        dispatch({
          type: 'user/updateProfile',
          payload: userData,
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
        toast.error(err.response?.data?.message || 'Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
        // Fallback to Redux user data if API call fails
        if (user) {
          setFormData({
            email: user.email || '',
            phone: user.phone || '',
            fullName: user.fullName || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || '',
            address: user.address || '',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Vui lòng nhập email hợp lệ');
      setLoading(false);
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
      setLoading(false);
      return;
    }

    // Kiểm tra ngày sinh
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        setError('Ngày sinh không thể là ngày trong tương lai');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await updateUserProfile({
        email: formData.email,
        phone: formData.phone,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address || null,
      });
      const updatedUser = response.data;
      dispatch({
        type: 'user/updateProfile',
        payload: updatedUser,
      });

      toast.success('Cập nhật hồ sơ thành công!');
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
      toast.error(err.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-page">
      <Container>
        <div className="header">
          <h4>Cập Nhật Hồ Sơ</h4>
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
                <p>Đang tải...</p>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label>Họ và Tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>Số Điện Thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="dateOfBirth">
                  <Form.Label>Ngày Sinh</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    placeholder="Chọn ngày sinh"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="gender">
                  <Form.Label>Giới Tính</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Địa Chỉ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Đang Cập Nhật...' : 'Cập Nhật Hồ Sơ'}
                </Button>
              </Form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UpdateProfilePage;
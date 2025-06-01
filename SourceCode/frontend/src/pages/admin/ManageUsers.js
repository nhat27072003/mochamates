import React, { useState, useEffect } from 'react';
import {
  BsEye,
  BsPencilSquare,
  BsTrash,
  BsPlusCircle,
  BsPeople,
  BsFilter
} from 'react-icons/bs';
import { getUsers, getUsersByRole, getUserById, createUser, updateUser, deleteUser } from '../../services/UserService';
import { formatDate } from '../../utils/helpers';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'CUSTOMER' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState({ username: '', email: '', password: '', role: '' });
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers(roleFilter, pagination.page, pagination.size);
  }, [roleFilter, pagination.page, pagination.size]);

  const fetchUsers = async (role, page, size) => {
    try {
      setLoading(true);
      const response = role === 'ALL' ? await getUsers(page, size) : await getUsersByRole(role, page, size);
      console.log('check get user res', response);
      setUsers(response.users || []);
      setPagination({
        ...pagination,
        page,
        size,
        totalPages: response.totalPages || 1,
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setShowCreateModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'CUSTOMER' });
      fetchUsers(roleFilter, pagination.page, pagination.size);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo người dùng');
    }
  };

  const handleViewUser = async (id) => {
    try {
      const response = await getUserById(id);
      console.log('check detail user', response);
      setSelectedUser(response);
      setShowViewModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết người dùng');
    }
  };

  const handleEditUser = async (id) => {
    try {
      const response = await getUserById(id);
      setEditUser({
        username: response.username,
        email: response.email,
        password: '',
        role: response.role,
      });
      setSelectedUser(response);
      setShowEditModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết người dùng');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser.id, editUser);
      setShowEditModal(false);
      setEditUser({ username: '', email: '', password: '', role: '' });
      setSelectedUser(null);
      fetchUsers(roleFilter, pagination.page, pagination.size);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật người dùng');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await deleteUser(id);
        fetchUsers(roleFilter, pagination.page, pagination.size);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể xóa người dùng');
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  return (
    <div className="manage-users-page p-4">
      <h4 className="admin-page-title d-flex align-items-center mb-4">
        <BsPeople size={24} className="me-2 text-primary" />
        Quản Lý Người Dùng
      </h4>

      {/* Role Filter and Add Button */}
      <div className="d-flex align-items-center gap-3 mb-4 justify-content-between">
        <div className="d-flex align-items-center ">
          <label className="form-label me-2 mb-0" htmlFor="roleFilter">
            <BsFilter size={18} className="me-1" />
            Lọc theo vai trò:
          </label>
          <select
            id="roleFilter"
            className="form-select w-auto"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPagination({ ...pagination, page: 0 });
            }}
          >
            <option value="ALL">Tất cả</option>
            <option value="ADMIN">Admin</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>
        <button
          className="btn btn-primary btn-md d-flex align-items-center"
          onClick={() => setShowCreateModal(true)}
        >
          <BsPlusCircle size={18} className="me-2" />
          Thêm Người Dùng
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm Người Dùng Mới</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mật Khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vai Trò</label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Đóng
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Tạo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi Tiết Người Dùng</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">ID</label>
                  <p>{selectedUser.id}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Tên</label>
                  <p>{selectedUser.username}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Vai Trò</label>
                  <p>{selectedUser.role}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Ngày Tham Gia</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Xác Minh</label>
                  <p>{selectedUser.verify ? 'Đã xác minh' : 'Chưa xác minh'}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh Sửa Người Dùng</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editUser.username}
                      onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editUser.email}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mật Khẩu (Để trống nếu không thay đổi)</label>
                    <input
                      type="password"
                      className="form-control"
                      value={editUser.password}
                      onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vai Trò</label>
                    <select
                      className="form-select"
                      value={editUser.role}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Đóng
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai Trò</th>
              <th>Ngày Tham Gia</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{formatDate(user.createAt)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-1"
                    title="Xem"
                    onClick={() => handleViewUser(user.id)}
                  >
                    <BsEye size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    title="Sửa"
                    onClick={() => handleEditUser(user.id)}
                  >
                    <BsPencilSquare size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    title="Xóa"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <BsTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-primary"
          disabled={pagination.page === 0}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Trước
        </button>
        <span>
          Trang {pagination.page + 1} / {pagination.totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={pagination.page + 1 >= pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default ManageUsers;
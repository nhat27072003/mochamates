import React from 'react';

const ManageUsers = () => {
  return (
    <div className="manage-users-page">
      <h1 className="admin-page-title">Manage Users</h1>
      {/* Placeholder content for managing users */}
      <p>User management interface will be here.</p>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Row */}
            <tr>
              <td>USR001</td>
              <td>Alice Wonderland</td>
              <td>alice@example.com</td>
              <td>Customer</td>
              <td>2024-01-15</td>
              <td>
                <button className="btn btn-sm btn-info me-1">View</button>
                <button className="btn btn-sm btn-warning me-1">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
            <tr>
              <td>USR002</td>
              <td>Bob The Builder</td>
              <td>bob@example.com</td>
              <td>Admin</td>
              <td>2023-11-20</td>
              <td>
                <button className="btn btn-sm btn-info me-1">View</button>
                <button className="btn btn-sm btn-warning">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
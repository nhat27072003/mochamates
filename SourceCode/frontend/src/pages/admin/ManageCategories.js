import React from 'react';

const ManageCategories = () => {
  return (
    <div className="manage-categories-page">
      <h1 className="admin-page-title">Manage Categories</h1>
      {/* Placeholder content for managing categories */}
      <p>Category management interface will be here.</p>
      <button className="btn btn-primary mb-3">Add New Category</button>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Product Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Row */}
            <tr>
              <td>CAT01</td>
              <td>Coffee Beans</td>
              <td>Whole and ground coffee beans</td>
              <td>15</td>
              <td>
                <button className="btn btn-sm btn-warning me-1">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
            <tr>
              <td>CAT02</td>
              <td>Brewing Equipment</td>
              <td>Manual and electric brewers</td>
              <td>25</td>
              <td>
                <button className="btn btn-sm btn-warning me-1">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
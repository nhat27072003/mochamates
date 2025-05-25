import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard'; // Import Dashboard
import ManageProducts from '../pages/admin/ManageProduct';
import ManageOrders from '../pages/admin/ManageOrders'; // Will be created
import ManageUsers from '../pages/admin/ManageUsers'; // Will be created
import ManageCategories from '../pages/admin/ManageCategories'; // Will be created
import ProductForm from '../pages/admin/ProductForm';
import OrderProcessing from '../pages/admin/OrderProcessing';

const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ManageProducts /> },
      { path: 'products/add', element: <ProductForm /> },
      { path: 'products/edit/:id', element: <ProductForm /> },
      { path: 'orders', element: <ManageOrders /> },
      { path: 'orders/pending', element: <OrderProcessing /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'categories', element: <ManageCategories /> },
    ],
  },
];

export default adminRoutes;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 'PROD001',
      name: 'Cà Phê Phin Đặc Biệt',
      category: 'Cà Phê Phin',
      price: 75000,
      stock: 100,
      description: 'Cà phê phin truyền thống, hương vị đậm đà.',
      volume: '200ml',
      flavor: 'Đậm',
    },
    {
      id: 'PROD002',
      name: 'Cà Phê Latte Mật Ong',
      category: 'Latte',
      price: 90000,
      stock: 50,
      description: 'Kết hợp latte với mật ong tự nhiên, vị ngọt nhẹ.',
      volume: '250ml',
      flavor: 'Ngọt Nhẹ',
    },
    {
      id: 'PROD003',
      name: 'Cà Phê Gói Cao Cấp',
      category: 'Cà Phê Đóng Gói',
      price: 120000,
      stock: 30,
      description: 'Cà phê gói cao cấp, tiện lợi.',
      weight: '500g',
      packageType: 'Hộp',
    },
    {
      id: 'PROD004',
      name: 'Cà Phê Đen Đá',
      category: 'Cà Phê Phin',
      price: 65000,
      stock: 80,
      description: 'Cà phê đen đá nguyên chất.',
      volume: '180ml',
      flavor: 'Đậm',
    },
    {
      id: 'PROD005',
      name: 'Cà Phê Cappuccino',
      category: 'Latte',
      price: 85000,
      stock: 60,
      description: 'Cappuccino béo ngậy.',
      volume: '220ml',
      flavor: 'Nhẹ',
    },
    {
      id: 'PROD006',
      name: 'Cà Phê Gói Tiêu Chuẩn',
      category: 'Cà Phê Đóng Gói',
      price: 90000,
      stock: 40,
      description: 'Cà phê gói tiêu chuẩn.',
      weight: '250g',
      packageType: 'Túi Zip',
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Số sản phẩm mỗi trang

  useEffect(() => {
    let result = [...products];

    // Tìm kiếm theo tên
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (filterCategory) {
      result = result.filter((product) => product.category === filterCategory);
    }

    // Sắp xếp
    if (sortOption) {
      result.sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'stock-asc') return a.stock - b.stock;
        if (sortOption === 'stock-desc') return b.stock - a.stock;
        return 0;
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset về trang 1 khi lọc hoặc sắp xếp
  }, [searchTerm, filterCategory, sortOption, products]);

  // Logic phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="manage-products-page">
      <div className="container">
        <h4 className="admin-page-title text-center mb-3">Quản Lý Sản Phẩm</h4>
        <div className="mb-3">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filterCategory} onChange={handleFilterChange}>
                <option value="">Lọc theo danh mục</option>
                <option value="Cà Phê Phin">Cà Phê Phin</option>
                <option value="Latte">Latte</option>
                <option value="Cà Phê Đóng Gói">Cà Phê Đóng Gói</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={sortOption} onChange={handleSortChange}>
                <option value="">Sắp xếp</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
                <option value="stock-asc">Kho: Tăng dần</option>
                <option value="stock-desc">Kho: Giảm dần</option>
              </select>
            </div>
            <div className="col-md-2">
              <Link to="/admin/products/add" className="btn btn-custom w-100">
                Thêm Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Mã Sản Phẩm</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Giá (VNĐ)</th>
                  <th>Kho</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price.toLocaleString('vi-VN')}</td>
                    <td>{product.stock}</td>
                    <td>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="btn btn-outline-custom me-2"
                      >
                        Sửa
                      </Link>
                      <button className="btn btn-danger-custom">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Phân trang */}
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mt-4 pagination-custom">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(number)}>
                    {number}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
              >
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
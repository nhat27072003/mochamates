import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsForAdmin, deleteProduct } from '../../services/ProductService';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/50?text=No+Image';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductsForAdmin(currentPage - 1, 10);
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        setTotalPages(data.totalPage || 1);
      } catch (err) {
        console.log(err)
        setError('Lỗi khi tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [currentPage]);

  useEffect(() => {
    let result = [...products];

    // Lọc theo tên
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo danh mục (type)
    if (filterCategory) {
      result = result.filter((product) => product.type === filterCategory);
    }

    // Sắp xếp
    if (sortOption) {
      result.sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [searchTerm, filterCategory, sortOption, products]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
        setFilteredProducts(filteredProducts.filter((p) => p.id !== id));
        setError(null);
      } catch (err) {
        setError('Lỗi khi xóa sản phẩm');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Kiểm tra tên sản phẩm hợp lệ
  const isValidName = (name) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(name);
  };

  // Kiểm tra URL ảnh hợp lệ (Cloudinary hoặc URL hợp lệ)
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return PLACEHOLDER_IMAGE;
    }
    return `${imageUrl}?w=50&h=50&c=fill`;
  };

  return (
    <div className="manage-products-page">
      <div className="container">
        <h4 className="admin-page-title text-center mb-3">Quản Lý Sản Phẩm</h4>
        {error && <div className="alert alert-danger small">{error}</div>}
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
                <option value="">Tất cả danh mục</option>
                <option value="READY_TO_DRINK_COFFEE">Cà phê pha sẵn</option>
                <option value="GROUND_COFFEE">Cà phê hạt/xay</option>
                <option value="PACKAGED_COFFEE">Cà phê đóng gói</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={sortOption} onChange={handleSortChange}>
                <option value="">Sắp xếp</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
              </select>
            </div>
            <div className="col-md-2">
              <Link to="/admin/products/add" className="btn btn-custom btn-sm w-100">
                Thêm Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="table-container">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Ảnh</th>
                      <th>Tên</th>
                      <th>Danh Mục</th>
                      <th>Giá (VNĐ)</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">Không có sản phẩm nào</td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <img
                              src={getImageUrl(product.imageUrl)}
                              alt={product.name}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          </td>
                          <td>
                            {isValidName(product.name) ? (
                              product.name
                            ) : (
                              <span className="text-danger">
                                {product.name} <small>(Tên không hợp lệ)</small>
                              </span>
                            )}
                          </td>
                          <td>
                            {product.type === 'READY_TO_DRINK_COFFEE' ? 'Cà phê pha sẵn' :
                              product.type === 'GROUND_COFFEE' ? 'Cà phê hạt/xay' :
                                'Cà phê đóng gói'}
                          </td>
                          <td>{product.price.toLocaleString('vi-VN')}</td>
                          <td>
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="btn btn-outline me-2"
                            >
                              Sửa
                            </Link>
                            <button
                              className="btn btn-danger btn-md"
                              onClick={() => handleDelete(product.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center mt-4">
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
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchProducts, getProductsByType } from '../../services/ProductService';
import { formatDate, formatPrice } from '../../utils/helpers';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const pageSize = 10;

  const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/50?text=No+Image';

  useEffect(() => {
    const loadProducts = async () => {
      try {

        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        const productData = filterCategory
          ? await getProductsByType(filterCategory, currentPage - 1, pageSize)
          : await fetchProducts(null, currentPage - 1, pageSize);
        console.log('check product data', productData)
        setProducts(productData.products || []);
        setFilteredProducts(productData.products || []);
        setTotalPages(productData.totalPage || 1);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Không thể tải danh sách sản phẩm');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [filterCategory, currentPage]);

  useEffect(() => {
    let filteredResult = [...products];

    // Apply client-side search by name
    if (searchTerm) {
      filteredResult = filteredResult.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOption) {
      filteredResult.sort((productA, productB) => {
        if (sortOption === 'price-asc') return productA.price - productB.price;
        if (sortOption === 'price-desc') return productB.price - productA.price;
        return 0;
      });
    }

    setFilteredProducts(filteredResult);
  }, [searchTerm, sortOption, products]);

  const handleProductDelete = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
        setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
        setSuccessMessage('Xóa sản phẩm thành công');
        setErrorMessage(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Lỗi khi xóa sản phẩm');
        setSuccessMessage('');
      }
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterCategoryChange = (event) => {
    setFilterCategory(event.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const isProductNameValid = (name) => {
    const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegexPattern.test(name);
  };

  const getProductImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return PLACEHOLDER_IMAGE_URL;
    }
    return `${imageUrl}?w=50&h=50&c=fill`;
  };

  return (
    <div className="manage-products-page p-4">
      <div className="container">
        <h4 className="admin-page-title d-flex align-items-center mb-4">
          <i className="bi bi-box-seam me-2"></i> Quản Lý Sản Phẩm
        </h4>

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show small" role="alert">
            {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
          </div>
        )}
        {/* {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show small" role="alert">
            {errorMessage}
            <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
          </div>
        )} */}

        <div className="mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterCategory}
                onChange={handleFilterCategoryChange}
              >
                <option value="">Tất cả danh mục</option>
                <option value="ROASTED_COFFEE">Cà phê rang xay</option>
                <option value="INSTANT_COFFEE">Cà phê hòa tan</option>
                <option value="READY_TO_DRINK_COFFEE">Cà phê uống liền</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={sortOption} onChange={handleSortOptionChange}>
                <option value="">Sắp xếp</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
              </select>
            </div>
            <div className="col-md-2">
              <Link
                to="/admin/products/add"
                className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-plus-circle me-2"></i> Thêm Sản Phẩm
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Danh Mục</th>
                    <th>Giá</th>
                    <th>Ngày Cập Nhật</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">Không có sản phẩm nào</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <img
                            src={getProductImageUrl(product.imageUrl)}
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>
                          {isProductNameValid(product.name) ? (
                            product.name
                          ) : (
                            <span className="text-danger">
                              {product.name} <small>(Tên không hợp lệ)</small>
                            </span>
                          )}
                        </td>
                        <td>
                          {product.type === 'ROASTED_COFFEE'
                            ? 'Cà phê rang xay'
                            : product.type === 'INSTANT_COFFEE'
                              ? 'Cà phê hòa tan'
                              : 'Cà phê uống liền'}
                        </td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{formatDate(product.updateAt)}</td>
                        <td>
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="btn btn-outline-warning btn-sm me-2"
                          >
                            Sửa
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleProductDelete(product.id)}
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

            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center mt-4">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    Trước
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <li
                    key={number}
                    className={`page-item ${currentPage === number ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => handlePageChange(number)}>
                      {number}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                    Tiếp
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
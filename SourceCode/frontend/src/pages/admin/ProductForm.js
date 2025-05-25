import React, { useState, useEffect, useRef, memo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, createProduct, updateProduct, uploadImage } from '../../services/ProductService';

// Simple UUID generator for stable keys
let idCounter = 0;
const generateId = () => `id-${idCounter++}`;

const Input = memo(({ label, name, type = 'text', required = false, short = false, medium = false, value, onChange, ...props }) => {
  const inputRef = useRef(null);

  return (
    <div className={`mb-2 ${short ? 'col short' : medium ? 'col medium' : 'col'}`}>
      <label htmlFor={name} className="form-label small">{label}</label>
      <input
        ref={inputRef}
        type={type}
        id={name}
        name={name}
        className="form-control form-control-sm"
        required={required}
        value={value}
        onChange={onChange}
        onBlur={() => console.log(`Blur on ${name}`)}
        {...props}
      />
    </div>
  );
});

const Textarea = memo(({ label, name, rows = 2, value, onChange }) => (
  <div className="mb-2 col">
    <label htmlFor={name} className="form-label small">{label}</label>
    <textarea
      id={name}
      name={name}
      className="form-control form-control-sm"
      rows={rows}
      value={value}
      onChange={onChange}
      onBlur={() => console.log(`Blur on ${name}`)}
    />
  </div>
));

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    type: 'READY_TO_DRINK_COFFEE',
    price: '',
    description: '',
    imageUrl: '',
    specificAttributes: {
      drinkType: '',
      ingredients: '',
      preparationTime: '',
      roastLevel: '',
      origin: '',
      roastDate: '',
      packType: '',
      instructions: '',
      expireDate: '',
    },
    options: [],
  });
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await fetchProductById(id);
          setProduct({
            ...data,
            price: data.price ? data.price.toString() : '',
            specificAttributes: {
              drinkType: data.specificAttributes?.drinkType || '',
              ingredients: data.specificAttributes?.ingredients?.join(', ') || '',
              preparationTime: data.specificAttributes?.preparationTime?.toString() || '',
              roastLevel: data.specificAttributes?.roastLevel || '',
              origin: data.specificAttributes?.origin || '',
              roastDate: data.specificAttributes?.roastDate || '',
              packType: data.specificAttributes?.packType || '',
              instructions: data.specificAttributes?.instructions || '',
              expireDate: data.specificAttributes?.expireDate || '',
            },
            options: Array.isArray(data.options) ? data.options.map(opt => ({
              ...opt,
              id: opt.id || generateId(),
              values: Array.isArray(opt.values) ? opt.values.map(val => ({
                ...val,
                id: val.id || generateId(),
              })) : [],
              isRequired: opt.isRequired ?? true,
            })) : [],
          });
          setImagePreview(data.imageUrl || null);
        } catch (err) {
          setError('Lỗi tải sản phẩm');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecificAttrChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      specificAttributes: { ...prev.specificAttributes, [name]: value },
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setImageUploading(true);
        setError(null);
        const imageUrl = await uploadImage(file);
        console.log("check image url", imageUrl);
        setProduct((prev) => ({ ...prev, imageUrl }));
        setImagePreview(imageUrl); // Dùng URL Cloudinary thay vì URL.createObjectURL
      } catch (err) {
        setError(err.message);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleOptionChange = (optionIndex, field, value) => {
    setProduct((prev) => {
      const newOptions = [...prev.options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
      return { ...prev, options: newOptions };
    });
  };

  const handleOptionValueChange = (optionIndex, valueIndex, field, value) => {
    setProduct((prev) => {
      const newOptions = [...prev.options];
      newOptions[optionIndex].values[valueIndex] = {
        ...newOptions[optionIndex].values[valueIndex],
        [field]: field === 'additionalPrice' ? Number(value) : value,
      };
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    setProduct((prev) => ({
      ...prev,
      options: [...prev.options, {
        id: generateId(),
        name: '',
        type: 'DROPDOWN',
        values: [{ id: generateId(), value: '', additionalPrice: 0 }],
        isRequired: true,
      }],
    }));
  };

  const addOptionValue = (optionIndex) => {
    setProduct((prev) => {
      const newOptions = [...prev.options];
      newOptions[optionIndex].values.push({ id: generateId(), value: '', additionalPrice: 0 });
      return { ...prev, options: newOptions };
    });
  };

  const removeOption = (optionIndex) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== optionIndex),
    }));
  };

  const removeOptionValue = (optionIndex, valueIndex) => {
    setProduct((prev) => {
      const newOptions = [...prev.options];
      newOptions[optionIndex].values = newOptions[optionIndex].values.filter((_, i) => i !== valueIndex);
      return { ...prev, options: newOptions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!product.name || !product.type || !product.price || isNaN(product.price) || Number(product.price) < 0) {
      setError('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...product,
        price: Number(product.price),
        specificAttributes: {
          ...product.specificAttributes,
          ingredients: product.specificAttributes.ingredients ? product.specificAttributes.ingredients.split(',').map(i => i.trim()) : [],
          preparationTime: product.specificAttributes.preparationTime ? Number(product.specificAttributes.preparationTime) : undefined,
          roastDate: product.specificAttributes.roastDate || undefined,
          expireDate: product.specificAttributes.expireDate || undefined,
        },
        options: product.options.map(({ id, ...option }) => ({
          ...option,
          values: option.values.map(({ id, ...value }) => value),
        })),
      };
      console.log('Submitting productData:', JSON.stringify(productData, null, 2));
      if (isEdit) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }
      navigate('/admin/products');
    } catch (err) {
      console.log(err.response.data);
      if (err.response.data != null) {
        setError(err.response.data.message)
        console.log('come heerere')
      }
      else
        setError('Có lỗi xảy ra, vui lòng thử lại sau ít phút')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page p-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Link to="/admin/products" className="btn btn-outline-secondary btn-sm btn-back">Quay Lại</Link>
          <h5 className="admin-page-title mx-auto">{isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h5>
        </div>
        {error && <div className="alert alert-danger small">{error}</div>}
        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <Input
                    label="Tên"
                    name="name"
                    required
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Tên sản phẩm"
                  />
                  <div className="mb-2 col medium">
                    <label htmlFor="type" className="form-label small">Danh Mục</label>
                    <select
                      id="type"
                      name="type"
                      value={product.type}
                      onChange={handleChange}
                      className="form-select form-select-sm"
                      required
                    >
                      <option value="READY_TO_DRINK_COFFEE">Cà phê pha sẵn</option>
                      <option value="GROUND_COFFEE">Cà phê hạt/xay</option>
                      <option value="PACKAGED_COFFEE">Cà Phê Đóng Gói</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <Input
                    label="Giá (VNĐ)"
                    name="price"
                    type="number"
                    required
                    medium
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Giá"
                    min="0"
                  />
                  <div className="mb-2 col">
                    <label htmlFor="imageUrl" className="form-label small">Hình Ảnh</label>
                    <input
                      type="file"
                      id="imageUrl"
                      name="imageUrl"
                      className="form-control form-control-sm"
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                      disabled={imageUploading}
                    />
                    {imageUploading && (
                      <div className="small text-muted mt-1">
                        Đang tải ảnh... <span className="spinner-border spinner-border-sm" role="status" />
                      </div>
                    )}
                  </div>
                </div>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="img-preview mt-2" style={{ maxWidth: '150px' }} />
                )}
                <Textarea
                  label="Mô Tả"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn"
                />

                <div className="type-specific-section mt-3">
                  <h6 className="section-title">Thông Tin Cụ Thể</h6>
                  {product.type === 'READY_TO_DRINK_COFFEE' && (
                    <div className="row">
                      <Input
                        label="Loại"
                        name="drinkType"
                        medium
                        value={product.specificAttributes.drinkType}
                        onChange={handleSpecificAttrChange}
                        placeholder="Loại đồ uống"
                      />
                      <Input
                        label="Thời Gian Pha (phút)"
                        name="preparationTime"
                        type="number"
                        short
                        value={product.specificAttributes.preparationTime}
                        onChange={handleSpecificAttrChange}
                        placeholder="Phút"
                        min="0"
                      />
                      <Textarea
                        label="Thành Phần"
                        name="ingredients"
                        rows={1}
                        value={product.specificAttributes.ingredients}
                        onChange={handleSpecificAttrChange}
                        placeholder="Thành phần, cách nhau bởi dấu phẩy"
                      />
                    </div>
                  )}
                  {product.type === 'GROUND_COFFEE' && (
                    <div className="row">
                      <Input
                        label="Rang"
                        name="roastLevel"
                        medium
                        value={product.specificAttributes.roastLevel}
                        onChange={handleSpecificAttrChange}
                        placeholder="Mức độ rang"
                      />
                      <Input
                        label="Nguồn Gốc"
                        name="origin"
                        medium
                        value={product.specificAttributes.origin}
                        onChange={handleSpecificAttrChange}
                        placeholder="Xuất xứ"
                      />
                      <Input
                        label="Ngày Rang"
                        name="roastDate"
                        type="date"
                        short
                        value={product.specificAttributes.roastDate}
                        onChange={handleSpecificAttrChange}
                        placeholder="Ngày rang"
                      />
                    </div>
                  )}
                  {product.type === 'PACKAGED_COFFEE' && (
                    <div className="row">
                      <Input
                        label="Bao Bì"
                        name="packType"
                        medium
                        value={product.specificAttributes.packType}
                        onChange={handleSpecificAttrChange}
                        placeholder="Loại bao bì"
                      />
                      <Input
                        label="HSD"
                        name="expireDate"
                        type="date"
                        short
                        value={product.specificAttributes.expireDate}
                        onChange={handleSpecificAttrChange}
                        placeholder="Hạn sử dụng"
                      />
                      <Textarea
                        label="Hướng Dẫn"
                        name="instructions"
                        rows={1}
                        value={product.specificAttributes.instructions}
                        onChange={handleSpecificAttrChange}
                        placeholder="Hướng dẫn sử dụng"
                      />
                    </div>
                  )}
                </div>

                <div className="option-section mt-3">
                  <label className="form-label small me-3">Tùy Chọn</label>
                  {product.options.map((option, optionIndex) => (
                    <div key={option.id} className="option-section border p-2 mb-2 rounded">
                      <div className="option-header row">
                        <Input
                          label="Tên Tùy Chọn"
                          name="name"
                          medium
                          value={option.name}
                          onChange={(e) => handleOptionChange(optionIndex, 'name', e.target.value)}
                          placeholder="VD: Size"
                        />
                        <div className="col short">
                          <label htmlFor={`type-${option.id}`} className="form-label small">Loại</label>
                          <select
                            id={`type-${option.id}`}
                            value={option.type}
                            onChange={(e) => handleOptionChange(optionIndex, 'type', e.target.value)}
                            className="form-select form-select-sm"
                          >
                            <option value="DROPDOWN">Dropdown</option>
                            <option value="CHECKBOX">Checkbox</option>
                            <option value="RADIO">Radio</option>
                          </select>
                        </div>
                        <div className="col short d-flex align-items-end">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm w-100"
                            onClick={() => removeOption(optionIndex)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                      {option.values.map((val, valueIndex) => (
                        <div key={val.id} className="option-value row">
                          <Input
                            label="Giá Trị"
                            name="value"
                            medium
                            value={val.value}
                            onChange={(e) => handleOptionValueChange(optionIndex, valueIndex, 'value', e.target.value)}
                            placeholder="VD: Small"
                          />
                          <Input
                            label="Phí Thêm (VNĐ)"
                            name="additionalPrice"
                            type="number"
                            short
                            value={val.additionalPrice}
                            onChange={(e) =>
                              handleOptionValueChange(optionIndex, valueIndex, 'additionalPrice', e.target.value)
                            }
                            placeholder="Phí"
                            min="0"
                          />
                          <div className="col short d-flex align-items-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm w-100"
                              onClick={() => removeOptionValue(optionIndex, valueIndex)}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mt-2"
                        onClick={() => addOptionValue(optionIndex)}
                      >
                        Thêm Giá Trị
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-primary btn-sm" onClick={addOption}>
                    Thêm Tùy Chọn
                  </button>
                </div>

                <button type="submit" className="btn btn-primary w-100 btn-sm mt-3 btn-submit" disabled={loading || imageUploading}>
                  {isEdit ? 'Cập Nhật' : 'Thêm'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
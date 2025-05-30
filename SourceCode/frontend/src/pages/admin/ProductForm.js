import React, { useState, useEffect, useRef, memo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, createProduct, updateProduct, uploadImage } from '../../services/ProductService';

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

const CheckboxGroup = memo(({ label, name, options, selectedValues, onChange }) => (
  <div className="mb-2 col">
    <label className="form-label small">{label}</label>
    <div className="d-flex flex-wrap">
      {options.map((option) => (
        <div key={option.value} className="form-check me-3">
          <input
            type="checkbox"
            id={`${name}-${option.value}`}
            className="form-check-input"
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={(e) => {
              const newValues = e.target.checked
                ? [...selectedValues, e.target.value]
                : selectedValues.filter((v) => v !== e.target.value);
              onChange(newValues);
            }}
          />
          <label htmlFor={`${name}-${option.value}`} className="form-check-label small">{option.label}</label>
        </div>
      ))}
    </div>
  </div>
));

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const iceLevelOptions = [
    { value: 'NO_ICE', label: 'Không đá' },
    { value: 'LESS_ICE', label: 'Ít đá' },
    { value: 'NORMAL_ICE', label: 'Bình thường' },
  ];
  const sugarLevelOptions = [
    { value: 'NO_SUGAR', label: 'Không đường' },
    { value: 'LESS_SUGAR', label: 'Ít đường' },
    { value: 'NORMAL_SUGAR', label: 'Bình thường' },
  ];
  const sizeOptionOptions = [
    { value: 'SMALL', label: 'Nhỏ' },
    { value: 'MEDIUM', label: 'Vừa' },
    { value: 'LARGE', label: 'Lớn' },
  ];
  const roastLevelOptions = [
    { value: 'LIGHT', label: 'Rang nhạt' },
    { value: 'MEDIUM', label: 'Rang vừa' },
    { value: 'DARK', label: 'Rang đậm' },
  ];
  const grindLevelOptions = [
    { value: 'WHOLE_BEAN', label: 'Nguyên hạt' },
    { value: 'FINE', label: 'Xay mịn' },
    { value: 'MEDIUM', label: 'Xay vừa' },
    { value: 'COARSE', label: 'Xay thô' },
  ];
  const weightOptions = [
    { value: 'G250', label: '250g' },
    { value: 'G500', label: '500g' },
    { value: 'KG1', label: '1kg' },
  ];

  const defaultIceLevels = iceLevelOptions.map(opt => opt.value);
  const defaultSugarLevels = sugarLevelOptions.map(opt => opt.value);
  const defaultSizeOptions = sizeOptionOptions.map(opt => opt.value);
  const defaultRoastLevels = roastLevelOptions.map(opt => opt.value);
  const defaultGrindLevels = grindLevelOptions.map(opt => opt.value);
  const defaultWeights = weightOptions.map(opt => opt.value);

  const [product, setProduct] = useState({
    name: '',
    type: 'READY_TO_DRINK_COFFEE',
    price: '',
    description: '',
    imageUrl: '',
    specificAttributesDTO: {
      iceLevels: defaultIceLevels,
      sugarLevels: defaultSugarLevels,
      sizeOptions: defaultSizeOptions,
      roastLevels: defaultRoastLevels,
      origin: '',
      roastDate: '',
      composition: '',
      grindLevels: defaultGrindLevels,
      weights: defaultWeights,
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
            specificAttributesDTO: {
              iceLevels: data.specificAttributesDTO?.iceLevels?.length > 0 ? Array.from(data.specificAttributesDTO.iceLevels) : defaultIceLevels,
              sugarLevels: data.specificAttributesDTO?.sugarLevels?.length > 0 ? Array.from(data.specificAttributesDTO.sugarLevels) : defaultSugarLevels,
              sizeOptions: data.specificAttributesDTO?.sizeOptions?.length > 0 ? Array.from(data.specificAttributesDTO.sizeOptions) : defaultSizeOptions,
              roastLevels: data.specificAttributesDTO?.roastLevels?.length > 0 ? Array.from(data.specificAttributesDTO.roastLevels) : defaultRoastLevels,
              origin: data.specificAttributesDTO?.origin || '',
              roastDate: data.specificAttributesDTO?.roastDate || '',
              composition: data.specificAttributesDTO?.composition || '',
              grindLevels: data.specificAttributesDTO?.grindLevels?.length > 0 ? Array.from(data.specificAttributesDTO.grindLevels) : defaultGrindLevels,
              weights: data.specificAttributesDTO?.weights?.length > 0 ? Array.from(data.specificAttributesDTO.weights) : defaultWeights,
              packType: data.specificAttributesDTO?.packType || '',
              instructions: data.specificAttributesDTO?.instructions || '',
              expireDate: data.specificAttributesDTO?.expireDate || '',
            },
            options: Array.isArray(data.options) ? data.options.map(opt => ({
              id: opt.id,
              name: opt.name,
              type: opt.type,
              values: Array.isArray(opt.values) ? opt.values.map(val => ({
                id: val.id,
                value: val.value,
                additionalPrice: val.additionalPrice,
              })) : [],
              isRequired: opt.required ?? true,
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
    setProduct((prev) => {
      if (name === 'type') {
        // Đặt lại specificAttributesDTO khi thay đổi type, mặc định chọn hết
        const newSpecificAttributesDTO = {
          iceLevels: value === 'READY_TO_DRINK_COFFEE' ? defaultIceLevels : [],
          sugarLevels: value === 'READY_TO_DRINK_COFFEE' ? defaultSugarLevels : [],
          sizeOptions: value === 'READY_TO_DRINK_COFFEE' ? defaultSizeOptions : [],
          roastLevels: value === 'ROASTED_COFFEE' ? defaultRoastLevels : [],
          origin: '',
          roastDate: '',
          composition: value === 'ROASTED_COFFEE' ? prev.specificAttributesDTO.composition : '',
          grindLevels: value === 'ROASTED_COFFEE' ? defaultGrindLevels : [],
          weights: value === 'ROASTED_COFFEE' ? defaultWeights : [],
          packType: value === 'PACKAGED_COFFEE' ? prev.specificAttributesDTO.packType : '',
          instructions: value === 'PACKAGED_COFFEE' ? prev.specificAttributesDTO.instructions : '',
          expireDate: value === 'PACKAGED_COFFEE' ? prev.specificAttributesDTO.expireDate : '',
        };
        return {
          ...prev,
          type: value,
          specificAttributesDTO: newSpecificAttributesDTO,
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSpecificAttrChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      specificAttributesDTO: { ...prev.specificAttributesDTO, [name]: value },
    }));
  };

  const handleSpecificAttrCheckboxChange = (name, values) => {
    setProduct((prev) => ({
      ...prev,
      specificAttributesDTO: { ...prev.specificAttributesDTO, [name]: values },
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setImageUploading(true);
        setError(null);
        const imageUrl = await uploadImage(file);
        setProduct((prev) => ({ ...prev, imageUrl }));
        setImagePreview(imageUrl);
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
        name: '',
        type: 'DROPDOWN',
        values: [{ value: '', additionalPrice: 0 }],
        isRequired: true,
      }],
    }));
  };

  const addOptionValue = (optionIndex) => {
    setProduct((prev) => {
      const newOptions = [...prev.options];
      newOptions[optionIndex].values.push({ value: '', additionalPrice: 0 });
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
        specificAttributesDTO: {
          iceLevels: product.specificAttributesDTO.iceLevels.length > 0 ? product.specificAttributesDTO.iceLevels : undefined,
          sugarLevels: product.specificAttributesDTO.sugarLevels.length > 0 ? product.specificAttributesDTO.sugarLevels : undefined,
          sizeOptions: product.specificAttributesDTO.sizeOptions.length > 0 ? product.specificAttributesDTO.sizeOptions : undefined,
          roastLevels: product.specificAttributesDTO.roastLevels.length > 0 ? product.specificAttributesDTO.roastLevels : undefined,
          origin: product.specificAttributesDTO.origin || undefined,
          roastDate: product.specificAttributesDTO.roastDate || undefined,
          composition: product.specificAttributesDTO.composition || undefined,
          grindLevels: product.specificAttributesDTO.grindLevels.length > 0 ? product.specificAttributesDTO.grindLevels : undefined,
          weights: product.specificAttributesDTO.weights.length > 0 ? product.specificAttributesDTO.weights : undefined,
          packType: product.specificAttributesDTO.packType || undefined,
          instructions: product.specificAttributesDTO.instructions || undefined,
          expireDate: product.specificAttributesDTO.expireDate || undefined,
        },
        options: product.options.map(option => ({
          id: option.id,
          name: option.name,
          type: option.type,
          values: option.values.map(value => ({
            id: value.id,
            value: value.value,
            additionalPrice: value.additionalPrice,
          })),
          isRequired: option.isRequired,
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
      console.error('Error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại sau ít phút');
      }
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
                      <option value="ROASTED_COFFEE">Cà phê hạt/xay</option>
                      <option value="INSTANT_COFFEE">Cà Phê Đóng Gói</option>
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
                      <CheckboxGroup
                        label="Mức Đá"
                        name="iceLevels"
                        options={iceLevelOptions}
                        selectedValues={product.specificAttributesDTO.iceLevels}
                        onChange={(values) => handleSpecificAttrCheckboxChange('iceLevels', values)}
                      />
                      <CheckboxGroup
                        label="Mức Đường"
                        name="sugarLevels"
                        options={sugarLevelOptions}
                        selectedValues={product.specificAttributesDTO.sugarLevels}
                        onChange={(values) => handleSpecificAttrCheckboxChange('sugarLevels', values)}
                      />
                      <CheckboxGroup
                        label="Kích Cỡ"
                        name="sizeOptions"
                        options={sizeOptionOptions}
                        selectedValues={product.specificAttributesDTO.sizeOptions}
                        onChange={(values) => handleSpecificAttrCheckboxChange('sizeOptions', values)}
                      />
                    </div>
                  )}
                  {product.type === 'ROASTED_COFFEE' && (
                    <div className="row">
                      <CheckboxGroup
                        label="Mức Rang"
                        name="roastLevels"
                        options={roastLevelOptions}
                        selectedValues={product.specificAttributesDTO.roastLevels}
                        onChange={(values) => handleSpecificAttrCheckboxChange('roastLevels', values)}
                      />
                      <Input
                        label="Nguồn Gốc"
                        name="origin"
                        medium
                        value={product.specificAttributesDTO.origin}
                        onChange={handleSpecificAttrChange}
                        placeholder="Xuất xứ"
                      />
                      <Input
                        label="Ngày Rang"
                        name="roastDate"
                        type="date"
                        short
                        value={product.specificAttributesDTO.roastDate}
                        onChange={handleSpecificAttrChange}
                        placeholder="Ngày rang"
                      />
                      <Input
                        label="Thành Phần"
                        name="composition"
                        medium
                        value={product.specificAttributesDTO.composition}
                        onChange={handleSpecificAttrChange}
                        placeholder="Thành phần"
                      />
                      <CheckboxGroup
                        label="Mức Xay"
                        name="grindLevels"
                        options={grindLevelOptions}
                        selectedValues={product.specificAttributesDTO.grindLevels}
                        onChange={(values) => handleSpecificAttrCheckboxChange('grindLevels', values)}
                      />
                      <CheckboxGroup
                        label="Khối Lượng"
                        name="weights"
                        options={weightOptions}
                        selectedValues={product.specificAttributesDTO.weights}
                        onChange={(values) => handleSpecificAttrCheckboxChange('weights', values)}
                      />
                    </div>
                  )}
                  {product.type === 'PACKAGED_COFFEE' && (
                    <div className="row">
                      <Input
                        label="Bao Bì"
                        name="packType"
                        medium
                        value={product.specificAttributesDTO.packType}
                        onChange={handleSpecificAttrChange}
                        placeholder="Loại bao bì"
                      />
                      <Input
                        label="HSD"
                        name="expireDate"
                        type="date"
                        short
                        value={product.specificAttributesDTO.expireDate}
                        onChange={handleSpecificAttrChange}
                        placeholder="Hạn sử dụng"
                      />
                      <Textarea
                        label="Hướng Dẫn"
                        name="instructions"
                        rows={3}
                        value={product.specificAttributesDTO.instructions}
                        onChange={handleSpecificAttrChange}
                        placeholder="Hướng dẫn sử dụng"
                      />
                    </div>
                  )}
                </div>

                <div className="option-section mt-3">
                  <label className="form-label small me-3">Tùy Chọn</label>
                  {product.options.map((option, optionIndex) => (
                    <div key={option.id || `option-${optionIndex}`} className="option-section border p-2 mb-2 rounded">
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
                          <label htmlFor={`type-${option.id || optionIndex}`} className="form-label small">Loại</label>
                          <select
                            id={`type-${option.id || optionIndex}`}
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
                        <div key={val.id || `value-${valueIndex}`} className="option-value row">
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

                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-sm mt-3 btn-submit"
                  disabled={loading || imageUploading}
                >
                  {isEdit ? 'Cập nhật' : 'Thêm mới'}
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
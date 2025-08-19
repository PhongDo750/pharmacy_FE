import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";

const Form = ({ fields, onSubmit, onCancel, initialValues, title = "Thêm sản phẩm mới" }) => {
  // Khởi tạo state ban đầu cho input
  const initialState = Object.keys(fields).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialValues || initialState);

  // Khi initialValues thay đổi (ví dụ: khi bấm Sửa dòng khác), cập nhật lại formData
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    } else {
      setFormData(initialState);
    }
    // eslint-disable-next-line
  }, [initialValues]);

  // Dùng 1 object lưu options riêng cho từng field
  const [fieldOptions, setFieldOptions] = useState(
    Object.keys(fields).reduce((acc, key) => {
      acc[key] = fields[key].options || [];
      return acc;
    }, {})
  );

  // Preload options cho các field select khi initialValues thay đổi (ví dụ khi mở form sửa)
  useEffect(() => {
    Object.entries(fields).forEach(([key, config]) => {
      if (config.type === "select" && config.onFocus) {
        config.onFocus((options) => {
          setFieldOptions((prev) => ({ ...prev, [key]: options }));
        });
      }
    });
    // eslint-disable-next-line
  }, [initialValues, fields]);

  // Xử lý khi người dùng thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi submit
  const handleSubmit = (e) => {
    const finalData = convertFormData(formData);
    e.preventDefault();
    onSubmit(finalData);
    setFormData(initialState); // reset nếu muốn
  };

  const convertFormData = (data) => {
      const result = { ...data };

      Object.keys(result).forEach((key) => {
        if (result[key] && typeof result[key] === "object" && result[key].id !== undefined) {
          result[key] = result[key].id; // Lấy id nếu là object
        }
    });

    return result;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl transform transition-all duration-300 animate-slideDown"
      >
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        {Object.entries(fields).map(([key, config]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.label}
            </label>

            {config.type === "async-select" && typeof config.asyncOptions === "function" ? (
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={config.asyncOptions}
                value={
                  formData[key]
                    ? {
                        value: formData[key]?.id || formData[key], // nếu là object thì lấy id, nếu là primitive thì giữ nguyên
                        label: formData[key]?.name || formData[`${key}Label`] || ""
                      }
                    : null
                }
                onChange={selected => {
                  setFormData(prev => ({
                    ...prev,
                    [key]: selected ? selected.value : "",
                    [`${key}Label`]: selected ? selected.label : ""
                  }));
                }}
                placeholder={config.placeholder || `Chọn ${config.label}`}
                isClearable
                classNamePrefix="react-select"
              />
            ) : (
              <input
                type={config.type}
                name={key}
                value={formData[key] ? formData[key] : ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;


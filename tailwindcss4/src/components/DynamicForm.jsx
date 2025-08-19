import React, { useState, useCallback, useMemo, useEffect } from "react";
import TextField from "./TextField";
import AsyncCreatableSelect from "react-select/async-creatable";

// Helper functions để tránh lặp code
const getAsyncSelectValue = (value) => {
  if (!value) return null;

  if (typeof value === 'object' && value.id) {
    return { value: value.id, label: value.name };
  }

  if (typeof value === 'string' && value) {
    return { value: value, label: value };
  }

  return null;
};

const getDefaultValue = (type) => {
  if (type === "number") {
    return "";
  } else if (type === "async-select") {
    return null;
  } else if (type === "checkbox") {
    return false;
  }
  return "";
};

const convertObjectToId = (obj, key) => {
  const value = obj[key];
  if (value && typeof value === 'object' && value.id) {
    obj[key] = value.id;
    if (key.endsWith('Id')) {
      const nameKey = key.replace(/Id$/, 'Name');
      obj[nameKey] = value.name;
    }
  }
};

// Component riêng cho AsyncSelect trong table
const TableAsyncSelect = React.memo(({ field, value, onChange }) => {
  const getTableSelectValue = useMemo(() => getAsyncSelectValue(value), [value]);

  const handleChange = useCallback(async (selected) => {
    console.log('Table Select changed:', selected);
    if (selected) {
      // Kiểm tra xem có phải là giá trị được tạo mới không
      if (selected.__isNew__) {
        await onChange({
          id: selected.value,
          name: selected.label,
          isNew: true
        });
      } else {
        await onChange({
          id: selected.value,
          name: selected.label
        });
      }
    } else {
      await onChange(null);
    }
  }, [onChange]);

  const styles = useMemo(() => ({
    control: (provided) => ({
      ...provided,
      minHeight: '32px',
      border: '1px solid #d1d5db'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: 'fixed',
      top: 'auto',
      left: 'auto',
      width: '200px',
      maxWidth: '200px'
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    option: (provided, state) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    })
  }), []);

  return (
    <AsyncCreatableSelect
      cacheOptions
      defaultOptions
      loadOptions={field.asyncOptions}
      value={getTableSelectValue}
      onChange={handleChange}
      placeholder={field.placeholder || `Chọn hoặc nhập ${field.label}`}
      isClearable
      isSearchable
      classNamePrefix="react-select"
      noOptionsMessage={() => "Không có dữ liệu"}
      loadingMessage={() => "Đang tải..."}
      formatCreateLabel={(inputValue) => `Tạo "${inputValue}"`}
      createOptionPosition="first"
      styles={styles}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      menuPlacement="auto"
    />
  );
});

const DynamicForm = ({ title, fields, onSubmit, onCancel, tableData, initialData = {}, mapDTO, onFieldChange }) => {
  // Khởi tạo form data
  const initialState = useMemo(() => {
    const baseState = {};
    fields.forEach(field => {
      baseState[field.key] = initialData[field.key] || getDefaultValue(field.type);
    });
    return baseState;
  }, [fields, initialData]);

  const [formData, setFormData] = useState(initialState);

  // Khởi tạo table rows
  const initialRows = useMemo(() => {
    if (initialData.items && initialData.items.length > 0) {
      return initialData.items;
    }

    const emptyRow = tableData.columns.reduce((acc, column) => {
      acc[column.key] = getDefaultValue(column.type);
      return acc;
    }, {});

    return [emptyRow];
  }, [initialData, tableData.columns]);

  const [formRows, setFormRows] = useState(initialRows);

  // ===== COMPUTED VALUES =====
  // Tính tổng tiền từ table rows
  const totalAmount = useMemo(() => {
    return formRows.reduce((total, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const unitPrice = parseFloat(row.unitPrice) || 0;
      return total + (quantity * unitPrice);
    }, 0);
  }, [formRows]);

  // ===== FORM HANDLERS =====
  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    console.log('Form field changed:', { name, type, value, checked, fieldValue });
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
  }, []);

  const handleAsyncSelectChange = useCallback((fieldKey) => async (selected) => {
    console.log('AsyncSelect changed:', { fieldKey, selected });

    let newValue;
    if (selected) {
      // Kiểm tra xem có phải là giá trị được tạo mới không (có __isNew__ property)
      if (selected.__isNew__) {
        newValue = {
          id: selected.value,
          name: selected.label,
          isNew: true
        };
      } else {
        newValue = {
          id: selected.value,
          name: selected.label
        };
      }
    } else {
      newValue = null;
    }

    setFormData(prev => {
      const updatedData = {
        ...prev,
        [fieldKey]: newValue
      };

      // Gọi callback nếu có để xử lý logic riêng
      if (onFieldChange && typeof onFieldChange === 'function') {
        // Xử lý async callback
        onFieldChange(fieldKey, newValue, updatedData, null, null).then(result => {
          if (result) {
            setFormData(currentData => ({ ...currentData, ...result }));
          }
        }).catch(error => {
          console.error('Error in onFieldChange:', error);
        });
      }

      return updatedData;
    });
  }, [onFieldChange]);

  // Cập nhật tổng tiền vào form data
  useEffect(() => {
    console.log('Total amount updated:', totalAmount);
    setFormData(prev => ({
      ...prev,
      totalPrice: totalAmount
    }));
  }, [totalAmount]);

  // ===== TABLE HANDLERS =====
  const handleRowChange = useCallback((rowIndex, fieldKey, value) => {
    console.log('Row changed:', { rowIndex, fieldKey, value });

    setFormRows(prev => {
      const newRows = [...prev];
      const updatedRow = { ...newRows[rowIndex], [fieldKey]: value };
      
      // Gọi callback nếu có để xử lý logic riêng cho table fields
      if (onFieldChange && typeof onFieldChange === 'function') {
        // Xử lý async callback
        onFieldChange(`row_${rowIndex}_${fieldKey}`, value, updatedRow, rowIndex, fieldKey).then(result => {
          if (result) {
            setFormRows(currentRows => {
              const updatedRows = [...currentRows];
              updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...result };
              return updatedRows;
            });
          }
        }).catch(error => {
          console.error('Error in onFieldChange for table:', error);
        });
      }
      
      console.log('Updated rows:', newRows);
      return newRows.map((row, index) => index === rowIndex ? updatedRow : row);
    });
  }, [onFieldChange]);

  const addRow = useCallback(() => {
    const newRow = tableData.columns.reduce((acc, column) => {
      acc[column.key] = getDefaultValue(column.type);
      return acc;
    }, {});
  
    setFormRows(prev => [...prev, newRow]);
  }, [tableData.columns]);

  const removeRow = useCallback((index) => {
    setFormRows(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ===== RENDER HELPERS =====
  const renderFormField = useCallback((field) => {
    const value = formData[field.key];
    console.log('Rendering field:', { key: field.key, type: field.type, value });

    switch (field.type) {
      case "async-select":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <AsyncCreatableSelect
              cacheOptions
              defaultOptions
              loadOptions={field.asyncOptions}
              value={getAsyncSelectValue(value)}
              onChange={handleAsyncSelectChange(field.key)}
              placeholder={field.placeholder || `Chọn hoặc nhập ${field.label}`}
              isClearable
              isSearchable
              classNamePrefix="react-select"
              noOptionsMessage={() => "Không có dữ liệu"}
              loadingMessage={() => "Đang tải..."}
              formatCreateLabel={(inputValue) => `Tạo "${inputValue}"`}
              createOptionPosition="first"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '38px',
                  border: '1px solid #d1d5db'
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999
                })
              }}
            />
          </div>
        );

      case "computed":
        console.log('Rendering computed field:', { key: field.key, value, totalAmount });
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-medium">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(totalAmount || 0)}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="mb-4">
            <div className="flex items-center">
              <TextField
                field={field}
                value={value}
                onChange={handleFormChange}
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <TextField
              field={field}
              value={value}
              onChange={handleFormChange}
            />
          </div>
        );
    }
  }, [formData, handleAsyncSelectChange, handleFormChange, totalAmount, fields]);

  const renderTableField = useCallback((field, value, onChange) => {
    console.log('renderTableField called:', { field: field.key, value, type: field.type });

    if (field.type === "async-select") {
      return (
        <TableAsyncSelect
          field={field}
          value={value}
          onChange={onChange}
        />
      );
    }

    return (
      <input
        type={field.type || "text"}
        value={value || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          // Chỉ cho phép nhập số cho quantity và unitPrice
          if ((field.key === 'quantity' || field.key === 'unitPrice') && newValue !== '') {
            const numericValue = newValue.replace(/[^0-9.]/g, '');
            onChange(numericValue);
          } else {
            onChange(newValue);
          }
        }}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        placeholder={field.placeholder}
      />
    );
  }, []);

  // ===== SUBMIT HANDLER =====
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Validation
    const requiredFields = fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => {
      const value = formData[field.key];
      if (field.type === "async-select") {
        // Với async-select, kiểm tra xem có object với id hoặc string value không
        return !value || (typeof value === 'object' && !value.id) || (typeof value === 'string' && !value.trim());
      } else if (field.type === "checkbox") {
        // Với checkbox, không cần validation required
        return false;
      }
      return !value;
    });

    if (missingFields.length > 0) {
      alert(`Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Convert form data (extract IDs from objects)
    const finalFormData = { ...formData };
    console.log('Before convertObjectToId - formData:', formData);
    Object.keys(finalFormData).forEach(key => {
      convertObjectToId(finalFormData, key);
    });
    console.log('After convertObjectToId - finalFormData:', finalFormData);

    // Convert table data
    const finalTableData = formRows.map(row => {
      const convertedRow = { ...row };
      Object.keys(convertedRow).forEach(key => {
        convertObjectToId(convertedRow, key);
      });
      return convertedRow;
    });

    // Map theo DTO ReceiptInput
    const receiptData = mapDTO(finalFormData, finalTableData);

    console.log("receiptData : ", receiptData);

    onSubmit(receiptData);

    // Reset form
    setFormData(initialState);
    setFormRows(initialRows);
  }, [formData, formRows, fields, onSubmit, initialState, initialRows, mapDTO]);

  // Validation props
  if (!title || !onSubmit || !onCancel) {
    console.warn("DynamicForm: title, onSubmit, and onCancel are required props");
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl transform transition-all duration-300 animate-slideDown max-h-[95vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {fields.map(field => (
            <div key={field.key}>
              {renderFormField(field)}
            </div>
          ))}
        </div>

        {/* Table */}
        {tableData && (
          <div className="mb-6 flex-1">
            <h3 className="text-lg font-semibold mb-3">{tableData.title}</h3>
            <div className="w-full overflow-x-auto relative border border-gray-200 rounded-lg">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    {tableData.columns.map((col) => (
                      <th
                        key={col.key}
                        className="border p-3 bg-gray-100 text-left whitespace-nowrap font-medium"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="border p-3 bg-gray-100 text-center w-16 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {formRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableData.columns.map((field) => (
                        <td key={field.key} className="border p-3">
                          {renderTableField(
                            field,
                            row[field.key],
                            (value) => handleRowChange(rowIndex, field.key, value)
                          )}
                        </td>
                      ))}
                      <td className="border p-3 text-center whitespace-nowrap">
                        {formRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(rowIndex)}
                            className="bg-red-500 text-white px-2 rounded mr-1 hover:bg-red-600 transition-colors"
                            aria-label="Xóa dòng"
                          >
                            −
                          </button>
                        )}
                        {rowIndex === formRows.length - 1 && (
                          <button
                            type="button"
                            onClick={addRow}
                            className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600 transition-colors"
                            aria-label="Thêm dòng"
                          >
                            +
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;

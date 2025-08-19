import AsyncCreatableSelect from "react-select/async-creatable";

const AsyncSelectField = ({ field, value, onChange }) => {
  console.log('AsyncSelectField received value:', value);
  console.log('AsyncSelectField field:', field);
  
  // Xử lý value để đảm bảo hiển thị đúng
  const getCurrentValue = () => {
    console.log('getCurrentValue called with:', value);
    
    if (!value) {
      console.log('Value is empty, returning null');
      return null;
    }
    
    // Nếu value là object có id và name
    if (typeof value === 'object' && value.id !== undefined) {
      const result = {
        value: value.id,
        label: value.name || ""
      };
      console.log('Value is object with id/name, returning:', result);
      return result;
    }
    
    // Nếu value là string (fallback)
    if (typeof value === 'string' && value) {
      const result = {
        value: value,
        label: value
      };
      console.log('Value is string, returning:', result);
      return result;
    }
    
    console.log('No matching case, returning null');
    return null;
  };

  const currentValue = getCurrentValue();
  console.log('Final currentValue:', currentValue);

  return (
    <AsyncCreatableSelect
      cacheOptions
      defaultOptions
      loadOptions={field.asyncOptions}
      value={currentValue}
      onChange={onChange}
      placeholder={field.placeholder || `Chọn hoặc nhập ${field.label}`}
      isClearable
      isSearchable
      classNamePrefix="react-select"
      noOptionsMessage={() => "Không có dữ liệu"}
      loadingMessage={() => "Đang tải..."}
      formatCreateLabel={(inputValue) => `Tạo "${inputValue}"`}
      createOptionPosition="first"
    />
  );
};

export default AsyncSelectField;

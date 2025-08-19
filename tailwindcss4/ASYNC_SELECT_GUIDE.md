# Hướng dẫn sử dụng AsyncSelect với API Search

## Tổng quan

AsyncSelect component đã được cấu hình để tự động gọi API khi người dùng gõ vào ô tìm kiếm. Tính năng này hoạt động với debounce 300ms để tối ưu hiệu suất.

## Cách hoạt động

### 1. Khi người dùng gõ vào AsyncSelect:
- Component sẽ gọi hàm `loadOptions` với `inputValue` là text người dùng đã gõ
- Hàm này sẽ gọi API search với keyword là text đã gõ
- Kết quả được format thành options cho React Select

### 2. Debounce:
- API chỉ được gọi sau khi người dùng ngừng gõ 300ms
- Tránh gọi API quá nhiều lần khi người dùng đang gõ nhanh

### 3. Cache:
- Sử dụng `cacheOptions` để cache kết quả đã tìm kiếm
- Tránh gọi API lại cho những từ khóa đã tìm kiếm

## Cách sử dụng

### 1. Trong FormFields.js:

```javascript
export const FormFields = {
  createPharmarcy: {
    unit: {
      label: "Đơn vị",
      type: "async-select",
      asyncOptions: (inputValue) => SelectFieldHelper.loadDynamicOptionsAsync(inputValue, "units")
    }
  }
};
```

### 2. Trong DynamicForm:

AsyncSelect sẽ tự động được render với các tính năng:
- `isSearchable`: Cho phép gõ để tìm kiếm
- `cacheOptions`: Cache kết quả
- `defaultOptions`: Load options mặc định khi mở dropdown
- `loadOptions`: Gọi API khi gõ

### 3. Trong Table:

```javascript
{
  label: "Tên thuốc", 
  key: "pharmacyId", 
  type: "async-select", 
  asyncOptions: (inputValue) => SelectFieldHelper.loadDynamicOptionsAsync(inputValue, "pharmacy")
}
```

## API Response Format

API phải trả về format:

```javascript
{
  content: [
    { id: 1, name: "Tên item 1" },
    { id: 2, name: "Tên item 2" }
  ]
}
```

SelectFieldHelper sẽ tự động convert thành:

```javascript
[
  { value: 1, label: "Tên item 1" },
  { value: 2, label: "Tên item 2" }
]
```

## Các tính năng đã được cải thiện

1. **Debounce 300ms**: Tránh gọi API quá nhiều
2. **Tăng pageSize**: Từ 5 lên 10 kết quả
3. **Logging chi tiết**: Để debug dễ dàng hơn
4. **isSearchable**: Đảm bảo có thể gõ để tìm kiếm
5. **Error handling**: Xử lý lỗi gracefully

## Test Component

Sử dụng `AsyncSelectTest.jsx` để test tính năng:

```javascript
import AsyncSelectTest from './components/AsyncSelectTest';

// Trong component của bạn
<AsyncSelectTest />
```

## Troubleshooting

### Nếu API không được gọi:
1. Kiểm tra console log để xem có lỗi gì không
2. Đảm bảo `field.asyncOptions` được định nghĩa đúng
3. Kiểm tra BaseService có hoạt động không

### Nếu không hiển thị kết quả:
1. Kiểm tra format response từ API
2. Đảm bảo API trả về `content` array
3. Kiểm tra `id` và `name` fields trong response

### Nếu gọi API quá nhiều:
1. Debounce đã được implement, kiểm tra xem có hoạt động không
2. Có thể tăng thời gian debounce nếu cần 
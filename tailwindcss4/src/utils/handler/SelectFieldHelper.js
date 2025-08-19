import { BaseService } from "../../services/base/BaseService";

export class SelectFieldHelper {
  // Cache để lưu trữ debounce timers
  static debounceTimers = new Map();

  // Hàm debounce helper cho AsyncSelect
  static debounceAsync(func, wait) {
    return function executedFunction(...args) {
      return new Promise((resolve) => {
        const later = () => {
          clearTimeout(SelectFieldHelper.debounceTimers.get(func));
          func(...args).then(resolve);
        };
        clearTimeout(SelectFieldHelper.debounceTimers.get(func));
        const timer = setTimeout(later, wait);
        SelectFieldHelper.debounceTimers.set(func, timer);
      });
    };
  }

  // Hàm gọi API thực tế
  static async _loadDynamicOptionsAsync(inputValue, key) {
    try {
      console.log(`Loading options for ${key} with input: "${inputValue}"`);
      
      const dynamicService = new BaseService(key);
      const response = await dynamicService.searchBase({
        pageNumber: 1,
        pageSize: 10, // Tăng số lượng kết quả
        sortBy: "id",
        direction: "asc",
        keyword: inputValue || ""
      });

      console.log(`API response for ${key}:`, response);

      // Đảm bảo trả về đúng format cho React Select
      const options = response.content.map(dynamic => ({
        value: dynamic.id,
        label: dynamic.name
      }));
      
      console.log(`Processed options for ${key}:`, options);
      return options;
    } catch (error) {
      console.error(`Lỗi khi load danh sách ${key} (async):`, error);
      return [];
    }
  }

  // Hàm cho React Select AsyncSelect với debounce
  static loadDynamicOptionsAsync = SelectFieldHelper.debounceAsync(
    SelectFieldHelper._loadDynamicOptionsAsync, 
    300
  ); // Debounce 300ms
}

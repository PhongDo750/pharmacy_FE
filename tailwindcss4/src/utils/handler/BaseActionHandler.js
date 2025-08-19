import { toast } from "react-toastify";

export class BaseActionHandler {
  constructor(service, updateQueryParams, setShowForm = null, queryParams = {}) {
    this.service = service;
    this.updateQueryParams = updateQueryParams;
    this.setShowForm = setShowForm;
    this.queryParams = queryParams;
  }

  async handleAdd(formData) {
    try {
      const response = await this.service.createBase(formData);

      if (response.success) {
        toast.success(response.data.message);
        this.setShowForm?.(false); // nếu setShowForm có thì gọi
        this.updateQueryParams({ reQuery: !this.queryParams.reQuery });
      } else {
        toast.error(response.message || "Thêm thất bại");
      }
    } catch (error) {
      console.error("[ERROR] handleAdd failed\n", error);
      toast.error("Có lỗi xảy ra khi thêm");
    }
  }

  async handleDelete(id) {
    try {
      const response = await this.service.deleteBase(id);

      if (response.success) {
        toast.success(response.data.message);
        this.updateQueryParams({ reQuery: !this.queryParams.reQuery });
      } else {
        toast.error(response.message || "Xóa thất bại");
      }
    } catch (error) {
      console.error("[ERROR] handleDelete failed\n", error);
      toast.error("Có lỗi xảy ra khi xóa");
    }
  }

  async handleUpdate(formData, id) {
    try {
      const response = await this.service.updateBase(formData, id);
      console.log("response", response);

      if (response.success) {
        toast.success(response.data.message);
        this.updateQueryParams({ reQuery: !this.queryParams.reQuery });
      } else {
        toast.error(response.message || "Thay đổi thất bại");
      }
    } catch (error) {
      console.error("[ERROR] handleUpdate failed\n", error);
      toast.error("Có lỗi xảy ra khi sửa");
    }
  }
}

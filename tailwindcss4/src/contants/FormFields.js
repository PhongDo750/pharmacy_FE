import { lazy } from "react";
import { SelectFieldHelper } from "../utils/handler/SelectFieldHelper";

export const FormFields = {
  createUnit : {
    name : {
      label : "Tên đơn vị",
      type : "text"
    }
  },
  createPharmarcy : {
    pharmacyName : {
      label : "Tên thuốc",
      type : "text"
    },
    description : {
      label : "Mô tả",
      type : "text"
    },
    pharmacyPrice : {
      label : "Giá bán",
      type : "number"
    },
    unit : {
      label : "Đơn vị",
      type : "async-select",
      asyncOptions: (inputValue) => SelectFieldHelper.loadDynamicOptionsAsync(inputValue, "units")
    }
  },
  receptionDetailModal : {
    title: "Chi tiết phiếu nhập",
    fields: [
      { label: "Nhà cung cấp", key: "supplierName" },
      { label: "Ngày nhập", key: "receiptDate" },
      { label: "Tổng tiền", key: "totalPrice" },
    ],
    tableData: {
      title: "Danh sách thuốc",
      columns: [
        { label: "Tên thuốc", key: "pharmacyName" },
        { label: "Số lượng", key: "quantity" },
        { label: "Đơn giá", key: "unitPrice" },
        { label: "Đơn vị", key: "unitName" },
      ],
      dataKey: "pharmacyResponses"
    },
  },
  createReception : {
    title : "Đơn nhập thuốc",
    fields: [
      { label: "Nhà cung cấp", key: "supplierId", type: "async-select", asyncOptions: (inputValue) => SelectFieldHelper.loadDynamicOptionsAsync(inputValue, "users") },
      { label: "Tổng tiền", key: "totalPrice", type: "computed" },
    ],
    tableData : {
      title: "Danh sách thuốc",
      columns: [
        { label: "Tên thuốc", key: "pharmacyUnitId", type: "async-select", asyncOptions :  (inputValue) => SelectFieldHelper.loadDynamicOptionsAsync(inputValue, "pharmacy")},
        { label: "Số lượng", key: "quantity", type: "number" },
        { label: "Đơn giá", key: "unitPrice", type: "number" },
      ]
    }
  },
  orderDetailModal : {
    title: "Chi tiết đơn hàng",
    fields: [
      { label: "Tên khách hàng", key: "fullName" },
      { label: "Số điện thoại", key: "phoneNumber" },
      { label: "Ngày tạo đơn", key: "orderDate" },
      { label: "Tổng tiền", key: "totalPrice" }
    ],
    tableData: {
      title: "Danh sách thuốc",
      columns: [
        { label: "Tên thuốc", key: "pharmacyName" },
        { label: "Số lượng", key: "quantity" },
        { label: "Đơn giá", key: "unitPrice" },
        { label: "Đơn vị", key: "unitName" },
      ],
      dataKey: "pharmacyResponses"
    },
  },
  createOrder : {
    title : "Đơn thuốc",
    fields: [
      { label: "Tên khách hàng", key: "userId", type: "async-select", asyncOptions: (inputValue) => SelectFieldHelper.loadDynamicOptionsAsync(inputValue, "users") },
      { label: "Số điện thoại", key: "phoneNumber", type: "text"},
      { label: "Điểm thưởng", key: "point", type: "number" },
      { label: "Sử dụng điểm thưởng", key: "isUsingPoint", type: "checkbox"},
      { label: "Tổng tiền", key: "totalPrice", type: "computed" },
    ],
    tableData : {
      title: "Danh sách thuốc",
      columns: [
        { label: "Tên thuốc", key: "pharmacyUnitId", type: "async-select", asyncOptions :  (inputValue) => SelectFieldHelper.loadDynamicOptionsAsync(inputValue, "pharmacy")},
        { label: "Số lượng", key: "quantity", type: "number" },
        { label: "Đơn giá", key: "unitPrice", type: "number" },
      ]
    }
  },
  createUser : {
    fullName : {
      label : "Tên khách hàng",
      type : "text"
    },
    phoneNumber : {
      label : "Số điện thoại",
      type : "text"
    },
    role : {
      label : "Vai trò",
      type : "text"
    }
  }
};

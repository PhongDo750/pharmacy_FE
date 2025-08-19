import { lazy } from "react";
import { useState } from "react";

const tabs = [
  { id: "unit", label: "Quản lý đơn vị tính" },
  { id: "product", label: "Quản lý sản phẩm" },
  {id: "receiption", label: "Quản lý nhập hàng"},
  {id: "order", label: "Quản lý đơn hàng"},
  { id: "user", label: "Quản lý khách hàng"},
  { id: "statistic", label: "Báo cáo thống kê" },
];

export default function Tabbar({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-4 border-b pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 ${
            activeTab === tab.id
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

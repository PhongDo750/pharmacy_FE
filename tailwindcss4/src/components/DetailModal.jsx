import React from "react";

// Component con để hiển thị field thông tin
const InfoField = ({ label, value }) => (
  <div>
    <span className="font-medium">{label}:</span>{" "}
    <span>{value || "--"}</span>
  </div>
);

// Component con để hiển thị table
const DataTable = ({ title, columns, rows }) => {
  const hasData = rows && rows.length > 0;
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="border p-2 bg-gray-100">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasData ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-2 text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td key={col.key} className="border p-2">
                      {row?.[col.key] ?? "--"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component chính
const DetailModal = ({ title, data, onClose, fields, tableData }) => {
  // Validation props
  if (!title || !onClose) {
    console.warn("DetailModal: title and onClose are required props");
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pt-20 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl transform transition-all duration-300 animate-slideDown relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
          aria-label="Đóng modal"
        >
          &times;
        </button>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* Các field thông tin */}
        {fields && fields.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {fields.map((field) => (
              <InfoField
                key={field.key}
                label={field.label}
                value={data?.[field.key]}
              />
            ))}
          </div>
        )}

        {/* Table dữ liệu */}
        {tableData && (
          <DataTable
            title={tableData.title}
            columns={tableData.columns || []}
            rows={tableData.rows || []}
          />
        )}
      </div>
    </div>
  );
};

export default DetailModal;

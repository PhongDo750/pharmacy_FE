import { useState } from "react";
import Form from "./Form";
import ConfirmBox from "./ConfirmBox";
import DetailModal from "./DetailModal";
import { FormFields } from "../contants/FormFields";

const Table = ({ columns, data, onDelete, onUpdate, editForm, detailModal }) => {
  const columnKeys = Object.keys(columns);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [deletingRowId, setDeletingRowId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [dataDetails, setDataDetails] = useState(null);

  const formatCellValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return value.name || "[Object]";
    }
    return value;
  };

  // ⚙️ Các hàm xử lý cho từng loại key đặc biệt
  const actionRenderMap = {
    operation: (row) => (
      <div className="flex space-x-2">
        <button
          onClick={() => {
            setEditingRow(row);
            setShowForm(true);
          }}
          className="text-blue-500 hover:underline"
        >
          Sửa
        </button>
        <button
          onClick={() => {
            setShowConfirmForm(true);
            setDeletingRowId(row.id);
          }}
          className="text-red-500 hover:underline"
        >
          Xoá
        </button>
      </div>
    ),
    details: (row) => (
      <div className="flex space-x-2">
        <button
          onClick={() => {
            setShowDetails(true);
            setDataDetails(row);
          }}
          className="text-green-500 hover:underline"
        >
          Xem chi tiết
        </button>
      </div>
    ),
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
      <table className="min-w-full text-left text-sm text-gray-800">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
          <tr>
            {columnKeys.map((key) => (
              <th key={key} className="px-4 py-3 border-b border-gray-200">
                {columns[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              {columnKeys.map((key) => (
                <td key={key} className="px-4 py-2 border-b border-gray-100">
                  {actionRenderMap[key]
                    ? actionRenderMap[key](row)
                    : formatCellValue(row[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <Form
          fields={editForm}
          onSubmit={(formData) => {
            onUpdate(formData, editingRow.id);
            setShowForm(false);
            setEditingRow(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingRow(null);
          }}
          initialValues={editingRow}
          title="Chỉnh sửa thông tin"
        />
      )}

      {showConfirmForm && (
        <ConfirmBox
          title="Bạn có muốn thực hiện xóa dữ liệu này không?"
          onCancel={() => setShowConfirmForm(false)}
          onSubmit={() => {
            onDelete(deletingRowId);
            setShowConfirmForm(false);
            setDeletingRowId(null);
          }}
        />
      )}

      {showDetails && (
        <DetailModal
          title={detailModal.title}
          data={dataDetails}
          onClose={() => {
            setShowDetails(false);
            setDataDetails(null);
          }}
          fields={detailModal.fields}
          tableData={{
            ...detailModal.tableData,
            rows:
              detailModal.tableData.dataKey &&
                dataDetails?.[detailModal.tableData.dataKey]
                ? dataDetails[detailModal.tableData.dataKey]
                : [],
          }}
        />
      )}
    </div>
  );
};

export default Table;

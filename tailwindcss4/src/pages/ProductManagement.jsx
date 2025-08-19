import React, { useState } from "react";
import Table from "../components/Table";
import Form from "../components/Form";
import { Column } from "../contants/Column";
import { FormFields } from "../contants/FormFields";
import { BaseService } from "../services/base/BaseService";
import { BaseActionHandler } from "../utils/handler/BaseActionHandler";
import { useQueryParams } from "../hooks/useQueryParams";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { PaginationContainer } from "../components/pagination/Pagination.container";

const ProductManagement = () => {
  const [showForm, setShowForm] = useState(false);

  const {queryParams, updateQueryParams} = useQueryParams({
          pageNumber: 1,
          pageSize: 10,
          sortBy: "createdAt,desc",
          direction: "asc",
          keyword: "",
          reQuery : false
      });

  const pharmacyService = new BaseService("pharmacy");
  const actionHandler = new BaseActionHandler(pharmacyService, updateQueryParams, setShowForm, queryParams);

  const handleAdd = (formData) => actionHandler.handleAdd(formData);
  const handleDelete = (id) => actionHandler.handleDelete(id);
  const handleUpdate = (formData, id) => actionHandler.handleUpdate(formData, id);

  const { data, totalPages, totalElements, loading, error } = usePaginatedData({
      callAPIFunction: (params) => pharmacyService.getBase(params),
      queryParams
    });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách thuốc</h1>
        <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Tìm kiếm tên thuốc..."
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                    updateQueryParams({
                        ...queryParams,
                        keyword: e.target.value,
                        pageNumber: 1
                    });
                }}
            />
            <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
            Thêm mới
            </button>
        </div>
      </div>

      {showForm && (
        <Form
          fields={FormFields.createPharmarcy}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table 
        columns={Column.pharmacy} 
        onDelete={handleDelete} 
        data={data} 
        onUpdate={handleUpdate} 
        editForm={FormFields.createPharmarcy} 
      />

      <PaginationContainer
                      pageNumber={queryParams.pageNumber}
                      totalPages={totalPages}
                      totalElements={totalElements}
                      setPageNumber={(pageNumber) => updateQueryParams({pageNumber})}
                  />
    </div>
  );
};

export default ProductManagement;

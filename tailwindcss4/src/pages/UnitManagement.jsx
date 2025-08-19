import { useState } from "react";
import Table from "../components/Table";
import { Column } from "../contants/Column";
import Form from "../components/Form";
import { FormFields } from "../contants/FormFields"; 
import { UnitService } from "../services/unit/UnitService";
import { toast } from "react-toastify";
import { useQueryParams } from "../hooks/useQueryParams";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { PaginationContainer } from "../components/pagination/Pagination.container";
import { BaseService } from "../services/base/BaseService";
import { BaseActionHandler } from "../utils/handler/BaseActionHandler";

const UnitManagement = () => {
  const [showForm, setShowForm] = useState(false);

  const unitService = new BaseService("units");

  const {queryParams, updateQueryParams} = useQueryParams({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "id",
        direction: "asc",
        keyword: "",
        reQuery : false
    });

  const actionHandler = new BaseActionHandler(unitService, updateQueryParams, setShowForm, queryParams);
  
  const handleAdd = (formData) => actionHandler.handleAdd(formData);
  const handleDelete = (id) => actionHandler.handleDelete(id);
  const handleUpdate = (formData, id) => actionHandler.handleUpdate(formData, id);

  const { data, totalPages, totalElements, loading, error } = usePaginatedData({
    callAPIFunction: (params) => unitService.getBase(params),
    queryParams
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách đơn vị</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Thêm mới
        </button>
      </div>
      
      {showForm && (
        <Form
          fields={FormFields.createUnit}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table 
      columns={Column.unit} 
      data={data} 
      onDelete={handleDelete} 
      onUpdate={handleUpdate} 
      editForm={FormFields.createUnit} />

      <PaginationContainer
                pageNumber={queryParams.pageNumber}
                totalPages={totalPages}
                totalElements={totalElements}
                setPageNumber={(pageNumber) => updateQueryParams({pageNumber})}
            />
    </div>
  );
}

export default UnitManagement;
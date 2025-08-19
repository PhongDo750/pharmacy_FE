import { useState, useCallback } from "react";
import Table from "../components/Table";
import { Column } from "../contants/Column";
import { FormFields } from "../contants/FormFields"; 
import { useQueryParams } from "../hooks/useQueryParams";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { PaginationContainer } from "../components/pagination/Pagination.container";
import { BaseService } from "../services/base/BaseService";
import { BaseActionHandler } from "../utils/handler/BaseActionHandler";
import DynamicForm from "../components/DynamicForm";
import { PharmacyService } from "../services/pharmacy/PharmacyService";

const ReceiptionManagement = () => {
    const [showForm, setShowForm] = useState(false);

    const receiptionService = new BaseService("receipts");
    const pharmacyService = new PharmacyService();

    const {queryParams, updateQueryParams} = useQueryParams({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "id",
        direction: "asc",
        keyword: "",
        reQuery : false
    });

    const actionHandler = new BaseActionHandler(receiptionService, updateQueryParams, setShowForm, queryParams);
    const handleAdd = (formData) => actionHandler.handleAdd(formData);

    const { data, totalPages, totalElements, loading, error } = usePaginatedData({
        callAPIFunction: (params) => receiptionService.getBase(params),
        queryParams
    });

    // Callback để xử lý auto-fill khi field thay đổi
    const handleFieldChange = useCallback(async (fieldKey, value, currentData, rowIndex, fieldKeyInRow) => {
        console.log('Field changed:', { fieldKey, value, currentData, rowIndex, fieldKeyInRow });

        // Xử lý khi chọn thuốc trong table
        if (fieldKeyInRow === 'pharmacyUnitId' && value && value.id) {
            try {
                const pharmacyDetails = await pharmacyService.getPharmacyUnitById(value.id);
                console.log('Pharmacy details received:', pharmacyDetails);
                if (pharmacyDetails && pharmacyDetails.success !== false) {
                    // Thử các field name khác nhau cho giá
                    const price = pharmacyDetails.price || 
                                 pharmacyDetails.pharmacyPrice || 
                                 pharmacyDetails.unitPrice || 
                                 pharmacyDetails.cost || 0;
                    console.log('Selected price:', price);
                    return {
                        unitPrice: price
                    };
                }
            } catch (error) {
                console.error('Error fetching pharmacy details:', error);
            }
        }

        return null;
    }, []);

    const mapDTOImportPharmacy = (finalFormData, finalTableData) => {
      return {
        supplierId: finalFormData?.supplierId,
        totalPrice: finalFormData?.totalPrice,
        pharmacyImportInputs: finalTableData || []
      }
    }

    return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách đơn nhập hàng</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Thêm mới
        </button>
      </div>
      
      {showForm && (
        <DynamicForm
          title={FormFields.createReception.title}
          fields={FormFields.createReception.fields}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          tableData={FormFields.createReception.tableData}
          mapDTO={mapDTOImportPharmacy}
          // Tắt tính năng tự động điền cho ReceptionManagement
          // onFieldChange={handleFieldChange}
        />
      )}

      <Table 
        columns={Column.receiption} 
        data={data} 
        detailModal={FormFields.receptionDetailModal} 
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

export default ReceiptionManagement;
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
import { UserService } from "../services/User/UserService";
import { PharmacyService } from "../services/pharmacy/PharmacyService";

const OrderManagement = () => {
    const [showForm, setShowForm] = useState(false);

    const orderService = new BaseService("orders");
    const userService = new UserService();
    const pharmacyService = new PharmacyService();

    const {queryParams, updateQueryParams} = useQueryParams({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "createdAt,desc",
        direction: "asc",
        keyword: "",
        reQuery : false
    });

    const actionHandler = new BaseActionHandler(orderService, updateQueryParams, setShowForm, queryParams);
    const handleAdd = (formData) => actionHandler.handleAdd(formData);

    const { data, totalPages, totalElements, loading, error } = usePaginatedData({
        callAPIFunction: (params) => orderService.getBase(params),
        queryParams
    });

    // Callback để xử lý auto-fill khi field thay đổi
    const handleFieldChange = useCallback(async (fieldKey, value, currentData, rowIndex, fieldKeyInRow) => {
        console.log('Field changed:', { fieldKey, value, currentData, rowIndex, fieldKeyInRow });
        console.log('FieldKey type:', typeof fieldKey, 'FieldKeyInRow type:', typeof fieldKeyInRow);
        console.log('FieldKey includes pharmacyUnitId:', fieldKey && fieldKey.includes('pharmacyUnitId'));
        console.log('FieldKeyInRow === pharmacyUnitId:', fieldKeyInRow === 'pharmacyUnitId');

        // Xử lý khi chọn khách hàng
        if (fieldKey === 'userId') {
            console.log('Processing userId change:', value);
            if (value && value.id) {
                try {
                    const userDetails = await userService.getUserById(value.id);
                    console.log('User details received:', userDetails);
                    console.log('User details type:', typeof userDetails);
                    console.log('User details keys:', Object.keys(userDetails || {}));
                    
                    // Kiểm tra response có hợp lệ không
                    if (userDetails && typeof userDetails === 'object') {
                        const result = {
                            phoneNumber: userDetails.phoneNumber || '',
                            point: userDetails.point || 0
                        };
                        console.log('Returning user auto-fill result:', result);
                        return result;
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                // Khi không có user được chọn, set point = 0
                const result = {
                    phoneNumber: '',
                    point: 0
                };
                console.log('Clearing user fields:', result);
                return result;
            }
        }

        // Xử lý khi chọn thuốc trong table
        console.log('Checking pharmacyUnitId condition:', { fieldKeyInRow, value, hasId: value && value.id, fieldKey });
        if ((fieldKeyInRow === 'pharmacyUnitId' || (fieldKey && fieldKey.includes('pharmacyUnitId'))) && value && value.id) {
            console.log('PharmacyUnitId condition met!');
            console.log('PharmacyUnitId condition met, fetching details...');
            try {
                const pharmacyDetails = await pharmacyService.getPharmacyUnitById(value.id);
                console.log('Pharmacy details received:', pharmacyDetails);
                console.log('Pharmacy details type:', typeof pharmacyDetails);
                console.log('Available fields:', Object.keys(pharmacyDetails || {}));
                
                // Kiểm tra response có hợp lệ không
                if (pharmacyDetails && typeof pharmacyDetails === 'object') {
                    // Thử các field name khác nhau cho giá
                    const price = pharmacyDetails.price || 
                                 pharmacyDetails.pharmacyPrice || 
                                 pharmacyDetails.unitPrice || 
                                 pharmacyDetails.cost || 0;
                    console.log('Selected price:', price);
                    const result = { unitPrice: price };
                    console.log('Returning pharmacy auto-fill result:', result);
                    return result;
                }
            } catch (error) {
                console.error('Error fetching pharmacy details:', error);
            }
        }

        console.log('No matching condition, returning null');
        return null;
    }, []);

    const mapDTOOrder = (finalFormData, finalTableData) => {
      console.log('mapDTOOrder - finalFormData:', finalFormData);
      console.log('mapDTOOrder - isUsingPoint value:', finalFormData?.isUsingPoint);
      const result = {
        userId: typeof finalFormData.userId === 'string' ? null : finalFormData?.userId,
        username: finalFormData?.userName,
        phoneNumber: finalFormData?.phoneNumber,
        point: finalFormData?.point,
        isUsingPoint: finalFormData?.isUsingPoint || false,
        totalPrice: finalFormData?.totalPrice,
        orderDetails: finalTableData || []
      };
      console.log('mapDTOOrder - final result:', result);
      return result;
    }

    return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách đơn mua của khách hàng</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Thêm mới
        </button>
      </div>
      
      {showForm && (
        <DynamicForm
          title={FormFields.createOrder.title}
          fields={FormFields.createOrder.fields}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          tableData={FormFields.createOrder.tableData}
          mapDTO={mapDTOOrder}
          onFieldChange={handleFieldChange}
        />
      )}

      <Table 
        columns={Column.order} 
        data={data}
        detailModal={FormFields.orderDetailModal}
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

export default OrderManagement;
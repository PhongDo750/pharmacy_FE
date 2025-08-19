import { useState } from "react";
import Table from "../components/Table";
import { Column } from "../contants/Column";
import { toast } from "react-toastify";
import { useQueryParams } from "../hooks/useQueryParams";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { PaginationContainer } from "../components/pagination/Pagination.container";
import { BaseService } from "../services/base/BaseService";
import { StatisticService } from "../services/statistic/StatisticService";

const StatisticManagement = () => {

  const statisticService = new BaseService("statistics");

  const statisticServiceCustome = new StatisticService();

  const {queryParams, updateQueryParams} = useQueryParams({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "",
        direction: "asc",
        keyword: "",
        reQuery : false
    });

  const { data, totalPages, totalElements, loading, error } = usePaginatedData({
    callAPIFunction: (params) => statisticService.getBase(params),
    queryParams
  });

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Báo cáo doanh số</h1>
        <div className="flex items-center gap-2">
            <input
                type="number"
                placeholder="Nhập tháng"
                value={month}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                    setMonth(e.target.value);
                }}
            />
            <input
                type="number"
                placeholder="Nhập năm"
                value={year}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                    setYear(e.target.value);
                }}
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => {
                    if (!month || !year) {
                        toast.error("Vui lòng nhập tháng và năm");
                        return;
                    }
                  
                    const keyword = `${month}-${year}`;
                    updateQueryParams({
                        keyword,
                        reQuery: true,
                        pageNumber: 1
                    });
                }}
            >
            Tìm kiếm
            </button>
        </div>
      </div>

      <Table 
          columns={Column.statistic} 
          data={data} 
        />

      <PaginationContainer
                pageNumber={queryParams.pageNumber}
                totalPages={totalPages}
                totalElements={totalElements}
                setPageNumber={(pageNumber) => updateQueryParams({pageNumber})}
            />
    </div>
  );
}

export default StatisticManagement;
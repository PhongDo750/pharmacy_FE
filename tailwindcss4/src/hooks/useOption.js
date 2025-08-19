import { usePaginatedData } from "../hooks/usePaginatedData";
import { BaseService } from "../services/base/BaseService";

export const useOptions = (key) => {

  const baseService = new BaseService(key);

  const { data } = usePaginatedData({
    callAPIFunction: (params) => baseService.getBase(params),
    queryParams: {
      pageNumber: 1,
      pageSize: 5,
      sortBy: "id",
      direction: "asc",
      keyword: ""
    }
  });

  return data;
};

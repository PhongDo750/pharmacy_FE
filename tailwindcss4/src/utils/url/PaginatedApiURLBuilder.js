import {QueryParamsBuilder} from "../query/QueryParamsBuilder";

export class PaginatedApiURLBuilder {
    constructor() {
    }
    setAPI(API){
        this.API = API;
        return this;
    }
    setQueryParams(queryParams) {
        this.queryString = new QueryParamsBuilder()
            .setPage(queryParams.pageNumber)
            .setPageSize(queryParams.pageSize)
            .setSort(queryParams.sortBy, queryParams.direction)
            .setKeyword(queryParams.keyword)
            .build();
        return this;
    }
    build() {
        return `${this.API}?${this.queryString}`
    }
}
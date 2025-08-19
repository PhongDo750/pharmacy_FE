export class QueryParamsBuilder {
    constructor() {
        this.searchParams = new URLSearchParams();
    }

    setPage(pageNumber) {
        this.searchParams.set('page', pageNumber - 1);
        return this;
    }
    setPageSize(pageSize) {
        this.searchParams.set('size', pageSize);
        return this;
    }
    setSort(sortBy, direction) {
        this.searchParams.set('sort', sortBy);
        this.searchParams.set('direction', direction);
        return this;
    }

    setKeyword(keyword) {
        if (keyword !== undefined && keyword !== null) {
            this.searchParams.set('keyword', keyword);
        }
        return this;
    }

    build() {
        return this.searchParams.toString();
    }
}
import { HTTPMethods } from "../../contants/ActionMethods";
import {BaseAPI} from "../base/BaseAPI";
import {CRUDService} from "../../utils/request/CRUDService";
import { Cookies } from "../../contants/Cookies";
import { Endpoints } from "../../contants/links/Endpoints";
import { PaginatedApiURLBuilder } from "../../utils/url/PaginatedApiURLBuilder";

export class BaseService {
    constructor(key) {
        this.baseAPI = new BaseAPI(key);
        this.crudService = new CRUDService();
    }

    async createBase(requestForm) {
        const response = await this.crudService.callPostAPI(
            this.baseAPI.createBase(),
            requestForm
        );
        return response;
    }

    async deleteBase(id) {
        const response = await this.crudService.callDeleteAPI(
            this.baseAPI.deleteBase(id)
        );
        return response;
    }

    async getBase(queryParams) {
        const paginatedAPI = new PaginatedApiURLBuilder()
            .setAPI(this.baseAPI.getBase())
            .setQueryParams(queryParams)
            .build();

        const response = await this.crudService.callGetAPI(
            paginatedAPI
        );
        return response;
    }

    async updateBase(requestForm, id) {
        const response = await this.crudService.callUpdateAPI(
            this.baseAPI.updateBase(id),
            requestForm
        );
        return response;
    }

    async searchBase(queryParams) {
        const paginatedAPI = new PaginatedApiURLBuilder()
            .setAPI(this.baseAPI.searchBase())
            .setQueryParams(queryParams)
            .build();

        const response = await this.crudService.callGetAPI(
            paginatedAPI
        );
        return response;
    }
    async getBaseById(id) {
        const response = await this.crudService.callGetAPI(
            this.baseAPI.getBaseById(id)
        );
        return response;
    }
}
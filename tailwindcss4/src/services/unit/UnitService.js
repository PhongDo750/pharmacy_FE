import { HTTPMethods } from "../../contants/ActionMethods";
import {UnitAPI} from "../unit/UnitAPI";
import {CRUDService} from "../../utils/request/CRUDService";
import { Cookies } from "../../contants/Cookies";
import { Endpoints } from "../../contants/links/Endpoints";
import { PaginatedApiURLBuilder } from "../../utils/url/PaginatedApiURLBuilder";

export class UnitService {
    constructor() {
        this.unitAPI = new UnitAPI();
        this.crudService = new CRUDService();
    }

    async createUnit(requestForm) {
        const response = await this.crudService.callPostAPI(
            this.unitAPI.createUnit(),
            null,
            requestForm
        );
        return response;
    }

    async deleteUnit(id) {
        const formData = {unitId:id}
        const response = await this.crudService.callDeleteAPI(
            this.unitAPI.deleteUnit(),
            formData
        );
        return response;
    }

    async getUnits(queryParams) {
        const paginatedAPI = new PaginatedApiURLBuilder()
            .setAPI(this.unitAPI.getUnits())
            .setQueryParams(queryParams)
            .build();

        const response = await this.crudService.callGetAPI(
            paginatedAPI
        );
        return response;
    }
}
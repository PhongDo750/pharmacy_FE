import {UnitAPI} from "../unit/UnitAPI";
import {CRUDService} from "../../utils/request/CRUDService";

export class StatisticService {
    constructor() {
        this.unitAPI = new UnitAPI();
        this.crudService = new CRUDService();
    }

    async getStatisticByMonthAndYear(month, year) {
        const response = await this.crudService.callGetAPI(
            this.unitAPI.getStatisticByMonthAndYear(month, year)
        );
        return response;
    }
}
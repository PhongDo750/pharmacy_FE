import { HTTPMethods } from "../../contants/ActionMethods";
import { AuthenticationAPI } from "../authentication/AuthenticationAPI";
import {CRUDService} from "../../utils/request/CRUDService";
import { Cookies } from "../../contants/Cookies";
import { Endpoints } from "../../contants/links/Endpoints";

export class AuthenticationService {
    constructor() {
        this.authenticationAPI = new AuthenticationAPI();
        this.crudService = new CRUDService();
    }

    async logIn(requestForm) {
        const response = await this.crudService.callPostAPI(
            this.authenticationAPI.logIn(),
            requestForm
        );

        const {success, data} = response
        console.log(response)
        if (success) {
            Cookies.setCookie("accessToken", data.result.accessToken);
            Cookies.setCookie("role", data.result.role);
        }
        return response;
    }
}
import {makeRequest} from "./RequestService";
import {toast} from "react-toastify";
import { ErrorMessages } from "../../contants/ErrorMessage";
import { HTTPMethods } from "../../contants/ActionMethods";

export class CRUDService {
    constructor() {}
    async callGetAPI(API) {
        try {
            console.info(`[DEBUG] Call API:\n${API}`);
            const response = await makeRequest({
                url: API,
                method: HTTPMethods.GET,
                needToken: true,
            });
            const {success, data} = response;
            if (success) return data.result;
        } catch (error) {
            console.error("[ERROR] \n", error.message);
            return {success: false, message: error.message || ErrorMessages.FETCH_FAILED}
        }
    }
    async callPostAPI(API, body = null){
        try {
            console.info(`[DEBUG] Call API:\n${API}`);
            return await makeRequest({
                url: API,
                method: HTTPMethods.POST,
                body: body,
                needToken: true
            });
        } catch (error) {
            console.error("[ERROR] \n", error.message);
            return {success: false, message: error.message || ErrorMessages.CREATED_FAILED}
        }
    }

    async callUpdateAPI(API, body){
        try {
            console.info(`[DEBUG] Call API:\n${API}`);
            // const {success, data} = await makeRequest({
            //     url: API,
            //     method: HTTPMethods.PUT,
            //     body: body,
            //     needToken: true
            // });
            // const result = data.result;
            // return {success, result};
            return await makeRequest({
                url: API,
                method: HTTPMethods.PUT,
                body: body,
                needToken: true
            });
        } catch (error) {
            console.error("[ERROR] \n", error.message);
            toast.error(error.message)
            return {success: false, message: error.message || ErrorMessages.UPDATED_FAILED}
        }
    }

    async callDeleteAPI(API){
        try {
            console.info(`[DEBUG] Call API:\n${API}`);
            return await makeRequest({
                url: API,
                method: HTTPMethods.DELETE,
                body: null,
                needToken: true
            });
        } catch (error) {
            console.error("[ERROR] \n", error.message);
            toast.error(error.message)
            return {success: false, message: error.message || ErrorMessages.DELETED_FAILED}
        }
    }
}
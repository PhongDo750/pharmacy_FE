import {URLBuilder} from "./URLBuilder";

export class ApiURLBuilder extends URLBuilder{
    constructor(url) {
        super(`${import.meta.env.VITE_REACT_APP_BASE_API_URL}${url}`);
    }
}
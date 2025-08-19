import { Cookies } from "../../contants/Cookies";
import {toast} from "react-toastify"
import { ErrorMessages } from "../../contants/ErrorMessage";
import { ApiLinks } from "../../contants/links/ApiLinks";

const getAccessToken = () => Cookies.getCookie(Cookies.accessToken);

const buildHeaders = (needToken = false) => {
    const headers = { "Content-Type": "application/json" };
    if (needToken) {
        const token = getAccessToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

export const makeRequest = async ({ url, method, body = null, needToken = false }) => {

    let headers = buildHeaders(needToken);
    let options = {headers, method};

    if (body) options.body = JSON.stringify(body);

    let response = await sendRequest(url, options);
    if (response.success) return response;

    if (response.status === 401) {
        const isTokenRefreshed = await refreshToken();
        if (isTokenRefreshed) {
            headers = buildHeaders(true);
            options.headers = headers;
            return await sendRequest(url, options);
        } else {
            return {
                success : false,
                message : ErrorMessages.FETCH_FAILED
            }
        }
    }

    if (response.status === 400) {
        toast.error(response.message);
    }
    
    return response;
}

const sendRequest = async (url, options) => {
     try {
        const response = await fetch(url, options);
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        return response.ok
            ? { success: true, data }
            : {
                success: false,
                status: response.status,
                message: data.message || ErrorMessages.FETCH_FAILED,
            };
    } catch (error) {
        console.error(`[ERROR] Sent Request Failed\n${error.message}`);
        return {
            success: false,
            status: 500,
            message: error.message || ErrorMessages.SERVICE_CONNECTION_FAILED,
        };
    }
}

const refreshToken = async () => {
    try {
        const oldToken = getAccessToken();

        const response = await fetch(ApiLinks.auth.refreshToken, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: oldToken }),
        });

        if (!response.ok) return false;

        const data = await response.json();

        Cookies.setCookie(Cookies.accessToken, data.result.token);

        console.info("[DEBUG] Refreshed Token Successfully]");

        return true;
    } catch (error) {
        console.error(`[ERROR] Refreshed Token Failed\n${error.message}`);
        return false;
    }
};
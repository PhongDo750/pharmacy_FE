const COOKIES_EXPIRY_TIME = 1;

export const Cookies =  {
    accessToken: 'accessToken',
    refreshToken: 'refresh-token',
    userInfo: 'user-info',
    mainRole: 'main-role',

    setCookie: (name, value) => setCookie(name, value),
    getCookie: (name) => getCookie(name),
    removeCookie: (name) => removeCookie(name),
}

function setCookie(name, value) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (COOKIES_EXPIRY_TIME * 24 * 60 * 60 * 1000));
    const expiresString = "expires=" + expires.toUTCString();
    
    let valueString;
    if (typeof value === 'object') {
        valueString = JSON.stringify(value);
    } else {
        valueString = value;
    }

    document.cookie = `${name}=${valueString}; ${expiresString}; path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            const value = c.substring(nameEQ.length, c.length);
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
    }
    
    return null;
}

const removeCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
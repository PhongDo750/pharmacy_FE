import { ApiURLBuilder } from '../../utils/url/ApiURLBuider'

export class AuthenticationAPI extends ApiURLBuilder {
    constructor() {
        super('/users')
    }
    logIn() {
        return this.url({path: '/log-in'})
    }
    refreshToken() {
        return this.url({path: '/token/refresh'})
    }
}
import { ApiURLBuilder } from '../../utils/url/ApiURLBuider'

export class BaseAPI extends ApiURLBuilder {
    constructor(key) {
        super(`/${key}`)
    }
    createBase() {
        return this.url({path: ''})
    }
    deleteBase(id) {
        return this.url({path: `/${id}`})
    }
    updateBase(id) {
        return this.url({path: `/${id}`})
    }
    getBase() {
        return this.url({path: ''})
    }
    searchBase() {
        return this.url({path: '/search'})
    }
    getBaseById(id) {
        return this.url({path: `/${id}`})
    }
}
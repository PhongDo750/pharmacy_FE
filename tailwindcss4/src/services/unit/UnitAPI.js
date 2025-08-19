import { ApiURLBuilder } from '../../utils/url/ApiURLBuider'

export class UnitAPI extends ApiURLBuilder {
    constructor() {
        super('/units')
    }
    createUnit() {
        return this.url({path: ''})
    }
    deleteUnit() {
        return this.url({path: ''})
    }
    updateUnit() {
        return this.url({path: ''})
    }
    getUnits() {
        return this.url({path: ''})
    }
}
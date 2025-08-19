import { ApiURLBuilder } from '../../utils/url/ApiURLBuider'

export class UnitAPI extends ApiURLBuilder {
    constructor() {
        super('/statistics')
    }
    getStatisticByMonthAndYear(month, year) {
        return this.url({path: `${month}/${year}`})
    }
}
export class URLBuilder {
    constructor(base) {
        this.base = base;
    }

    url({ path = '' } = {}) {
        if (!path) return this.base;
        return path.startsWith('/')
            ? `${this.base}${path}`
            : `${this.base}/${path}`;
    }
}
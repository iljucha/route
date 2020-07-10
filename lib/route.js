// @ts-check

/**
 * @typedef {(args: Array<any>) => any} Handler
 */

export default class Route {
    /** @type {RegExp} */
    #matcher
    /** @type {string} */
    #method
    /** @type {Handler} */
    #handler
    /** @type {string} */
    #route

    /**
     * @param {string} method
     * @param {string} route
     * @param {Handler} handler
     */
    constructor(method, route, handler) {
        this.#method = method
        this.#route = route
        this.#handler = handler
        this.#matcher = new RegExp("^" + route.replace(/\:([a-zA-Z]+)/gi, "(?<$1>[^\\/\\:\\?]+?)") + "/?$")
    }

    /**
     * @param {string} method - IncomingMessage method
     * @param {string} url - IncomingMessage url
     * @returns {boolean}
     */
    match(method, url) {
        if (this.route === "/*") {
            return true
        }
        if (this.matcher.test(url) && (this.method === method || this.method === "ANY")) {
            return true
        }
        else {
            return false
        }
    }

    /**
     * @param {string} url
     * @returns {any}
     */
    params(url) {
        url = url.split("?")[0] || url
        const match = this.matcher.exec(url)
        if (match) {
            if (match.groups) {
                return { ...match.groups }
            }
            return { }
        }
        return null
    }

    get matcher() {
        return this.#matcher
    }

    get method() {
        return this.#method
    }

    get handler() {
        return this.#handler
    }

    get route() {
        return this.#route
    }
}
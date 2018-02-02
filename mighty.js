const util = require('./util')

class Mighty {
    constructor(obj, options = {}) {
        if (options.clone)
            this.obj = util.clone(obj)
        else
            this.obj = obj
    }

    morph(original, destination) {
        this.destination = destination

        this.value = util.extract(this.obj, original)
        const composed = util.build(this.destination, this.value)

        util.assign(this.obj, composed)

        this.remove(original)

        return this
    }

    combine(keys, destination, separator) {
        this.destination = destination

        const data = []
        keys.forEach((key, index) => {
            const value = util.extract(this.obj, key)

            data.push({ key, value })

            this.remove(key)
        }, this)

        this.value = util.merge(data)
        const composed = util.build(this.destination, this.value)
        util.assign(this.obj, composed)

        return this
    }

    add(destination, value) {
        this.destination = destination
        this.value = value

        const composed = util.build(this.destination, this.value)

        util.assign(this.obj, composed)

        return this
    }

    remove(key) {
        util.clear(this.obj, key)

        return this
    }

    coerce(destination, type) {
        if (this.destination) {
            type = destination
        } else {
            this.destination = destination
            this.value = util.extract(this.obj, this.destination)
        }

        switch(type) {
            case 'number': {
                const coerced = util.build(this.destination, parseFloat(this.value))
                Object.assign(this.obj, coerced)
                return this
            }
            case 'string': {
                const coerced = util.build(this.destination, this.value.toString())
                Object.assign(this.obj, coerced)
                return this
            }
            // TODO add case 'array' to coerce comma separates values to an array
        }
    }

    get result() {
        return this.obj
    }
}

module.exports = (obj, options) => {
    return new Mighty(obj, options)
}

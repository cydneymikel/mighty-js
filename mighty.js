const util = require('./util')

class Mighty {
    constructor(obj, options = {}) {
        if (options.clone)
            this.obj = util.clone(obj)
        else
            this.obj = obj
    }

    morph(original, key) {
        this.original = original
        this.key = key

        this.value = util.extract(this.obj, this.original)
        const composed = util.build(this.key, this.value)

        Object.keys(composed).forEach((key, index) => {
            if (this.obj[key])
                Object.assign(this.obj[key], composed[key])
            else
                Object.assign(this.obj, composed)
        })

        this.remove(this.original)

        return this
    }

    add(key, value) {
        this.key = key
        this.value = value

        const composed = util.build(this.key, this.value)

        Object.assign(this.obj, composed)

        return this
    }

    remove(key) {

        util.clear(this.obj, key)

        return this
    }

    coerce(key, type) {
        if (this.key) {
            type = key
        } else {
            this.key = key
            this.value = util.extract(this.obj, this.key)
        }

        switch(type) {
            case 'number': {
                const coerced = util.build(this.key, parseFloat(this.value))
                Object.assign(this.obj, coerced)
                return this
            }
            case 'string': {
                const coerced = util.build(this.key, this.value.toString())
                Object.assign(this.obj, coerced)
                return this
            }
            // TODO add array
        }
    }

    get result() {
        return this.obj
    }
}

module.exports = (obj, options) => {
    return new Mighty(obj, options)
}

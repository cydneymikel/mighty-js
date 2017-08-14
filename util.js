module.exports = {

    /*
        * @description      clones object so that it is not mutated
        * @arguments
            obj             original object passed into mighty
    */
    clone(obj) {
        try {
            return JSON.parse(JSON.stringify(obj))
        } catch (e) {
            return { error: 'failed to parse' }
        }
    },

    /*
        * @description      extracts value from original key in object
        * @arguments
            obj             original object passed into mighty
            str             path to key using dot notation
    */
    extract(obj, str) {
        const
            clone = this.clone(obj),
            keys = str.split('.')

        return keys.reduce((acc, key) => acc[key], clone)
    },

    /*
        * @description      builds object with new key/value pair
        * @arguments
            str             path to key using dot notation
            value           value that was returned from extract()
    */
    build(str, value) {
        const
            base = {},
            keys = str.split('.')

        keys.reduce((acc, key, index) => {
            if (index === keys.length - 1)
                return acc[key] = value
            else
                return acc[key] = {}
        }, base)

        return base
    },

    /*
        * @description      removes key/value from object
        * @arguments
            obj             original object passed into mighty
            key             key that should be removed
    */
    clear(obj, key) {
        delete obj[key]
    },

    /*
        * @description      removes nested key/value from object
        * @arguments
            obj             original object passed into mighty
            keys            path of keys as an array
                             the last key/value in the array will be removed.
    */
    clearNested(obj, keys) {
        const base = {}

        keys.reduce((acc, key, index) => {
            if (index !== keys.length - 1)
                return acc[key] = {}
        }, base)

        Object.assign(obj, base)
    }
}
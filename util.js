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
        * IN PROGRESS
        * @description      merges/combines values
        * @arguments
            keys            array of values to combine
            destination     destination key
            seperator       seperator for the combined key (optional)
    */
    merge(values, destination, seperator) {
        let merged = ''

        values.forEach((value, index) => {
            if (typeof value === 'string') {
                if (index !== values.length - 1)
                    merged += value + (seperator || ' ')
                else
                    merged += value
            }
            // else if (typeof value === 'number')

            // else if (typeof value === 'object'  && value instanceof Array)

            // else

        })

        return merged
    },

    /*
        * @description      assigns the new composed key to the object
        * @arguments
            obj             original object passed into mighty
            composed        the composed key from morph, combine, add or remove
    */
    assign(obj, composed) {
        Object.keys(composed).forEach(key => {
            if (obj[key])
                Object.assign(obj[key], composed[key])
            else
                Object.assign(obj, composed)
        })
    },

    /*
        * @description      removes key/value from object
        * @arguments
            obj             original object passed into mighty
            keys            path of keys as dot notation
    */
    clear(obj, key, last) {
        const keys = key.split('.')

        keys.reduce((acc, key, index) => {
            if (index !== keys.length - 1)
                return acc[key]
            else if (Object.keys(acc).length > 1)
                keys.length = 0
            else
                last = keys.pop()

            delete acc[key]
        }, obj)

        if (keys.length)
            this.clear(obj, keys.join('.'), last)
        else
            return obj
    }
}
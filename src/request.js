const request = {
    from: (entity, settings) => {
        const instance = new entity()
        const properties =  Object.getOwnPropertyNames(instance)
        const result = {}
        const schema = { ...entity.prototype.meta.schema }

        properties.forEach (property => {
            if (settings && settings.ignore && settings.ignore.includes(property)) return

            result[property] = schema[property].type
        })

        if (settings && settings.ignoreIDs)
            delete result.id

        return result
    }
}

module.exports = { request }
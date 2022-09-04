const request = {
    from: (entity, settings) => {
        const instance = new entity()
        const properties = Object.getOwnPropertyNames(instance)
        const result = {}
        const schema = { ...entity.prototype.meta.schema }

        properties.forEach(property => {
            // ignore fields
            if (settings && settings.ignore && settings.ignore.includes(property)) return

            // ignore IDs
            if (settings && settings.ignoreIDs && schema[property].options.isId) return

            result[property] = schema[property].type
        })

        return result
    }
}

module.exports = { request }
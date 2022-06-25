class Request {
    from(requestInputObject, settings) {
        const objectInstance = new requestInputObject()
        const objectProperties =  Object.getOwnPropertyNames(objectInstance)
        const requestResultObject = {}
        const requestSchemaClone = { ...requestInputObject.prototype.meta.schema }

        objectProperties.forEach (property => {
            if (settings && settings.ignore && settings.ignore.includes(property)) return

            requestResultObject[property] = requestSchemaClone[property].type
        })

        if (settings && settings.ignoreIDs)
            delete requestResultObject.id

        return requestResultObject
    }
}

const request = new Request()

module.exports = { request }
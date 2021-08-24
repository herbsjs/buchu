const objectSerialization = (data) => {

    const circularStructureCache = []
    return JSON.parse(JSON.stringify(data, (_, value) => {
        if (typeof value === 'object' && value !== null) {
            if (circularStructureCache.includes(value)) return
            circularStructureCache.push(value)
        }
        return value
    }))
}

module.exports = objectSerialization

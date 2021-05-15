const assert = require('assert')
const { isAsyncFunction } = require('./functionHelper')

describe('Function Helper', () => {

    it('Should validate async function ', async () => {

        // Given
        const func = async () => {}

        // When
        const ret = isAsyncFunction(func)

        // Then
        assert.strictEqual(ret, true)
    })

    it('Should validate sync function ', async () => {

        // Given
        const func = async () => {}

        // When
        const ret = isAsyncFunction(func)

        // Then
        assert.strictEqual(ret, false)
    })

})
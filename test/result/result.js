const { Ok, Err } = require('../../src/results')
const assert = require('assert')

describe('When I got a result', () => {
    describe('if result is empty OK', () => {
        const ok = Ok()

        it('should return true on "isOk" property', async () => {
            assert.equal(ok.isOk, true)
        })

        it('should not return error on "isErr" property', async () => {
            assert.equal(ok.isErr, false)
        })

        it('should not return undefined on "ok" property', async () => {
            assert.equal(ok.ok, undefined)
        })

        it(`should return "NULL" on "err" property`, async () => {
            assert.equal(ok.err, null)
        })

        it(`should return "OK" on "toString" method`, async () => {
            assert.equal(ok.toString(), 'Ok')
        })

        it(`should return "{ ok: undefined }" on "toJSON" method`, async () => {
            assert.deepEqual(ok.toJSON(), { ok: undefined })
        })
    })

    describe('if result is filled OK', () => {
        const expectedMessage = "message"
        const ok = Ok(expectedMessage)

        it('should return true on "isOk" property', async () => {
            assert.equal(ok.isOk, true)
        })

        it('should not return error on "isErr" property', async () => {
            assert.equal(ok.isErr, false)
        })

        it('should not return undefined on "ok" property', async () => {
            assert.equal(ok.ok, expectedMessage)
        })

        it(`should return "NULL" on "err" property`, async () => {
            assert.equal(ok.err, null)
        })

        it(`should return "OK: ${JSON.stringify(expectedMessage)}" on "toString" method`, async () => {
            assert.equal(ok.toString(), `Ok: ${JSON.stringify(expectedMessage)}`)
        })

        it(`should return "{ ok: ${expectedMessage} }" on "toJSON" method`, async () => {
            assert.deepEqual(ok.toJSON(), { ok: expectedMessage })
        })
    })


    describe('if result is empty Err', () => {
        const error = Err()

        it('should return false on "isOk" property', async () => {
            assert.equal(error.isOk, false)
        })

        it('should return true on "isErr" property', async () => {
            assert.equal(error.isErr, true)
        })

        it('should return null on "ok" property', async () => {
            assert.equal(error.ok, null)
        })

        it('should return undefined on "err" property', async () => {
            assert.equal(error.err, null)
        })

        it(`should return "Error" on "toString" method`, async () => {
            assert.equal(error.toString(), 'Error')
        })

        it(`should return "{ error: ${undefined} }" on "toJSON" method`, async () => {
            assert.deepEqual(error.toJSON(), { error: undefined })
        })
    })

    describe('if result is a Error filled with a string', () => {
        const expectedMessage = "Error"
        const error = Err(expectedMessage)

        it('should return false on "isOk" property', async () => {
            assert.equal(error.isOk, false)
        })

        it('should return true on "isErr" property', async () => {
            assert.equal(error.isErr, true)
        })

        it('should return null on "ok" property', async () => {
            assert.equal(error.ok, null)
        })

        it(`should return "${expectedMessage}" on "err" property`, async () => {
            assert.equal(error.err, expectedMessage)
        })

        it(`should return "Error: ${expectedMessage}" on "toString" method`, async () => {
            assert.equal(error.toString(), `Error: ${JSON.stringify(expectedMessage)}`)
        })

        it(`should return "{ error: ${expectedMessage} }" on "toJSON" method`, async () => {
            assert.deepEqual(error.toJSON(), { error: expectedMessage })
        })
    })
})
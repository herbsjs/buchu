const assert = require('assert')
const fs = require('fs')
const {entity, field} = require('@herbsjs/gotu')

const { schema } = require('../../../src/schema')

describe('Request schema validation', () => {

    it('should validate request (flat and simple)', () => {
        // given
        const requestSchema = { name: String, at: Date, able: Boolean, age: Number, meta: Object, many: Array }
        const scm = schema(requestSchema)
        const request = { name: "jhon", at: new Date('2001-01-01'), able: true, age: 50, meta: {}, many: [1, 2] }
        // when
        const ret = scm.validate(request)
        // then
        assert.strictEqual(ret, true)
        assert.strictEqual(scm.isValid, true)
    })

    it('should validate request (partial - more keys on schema)', () => {
        // given
        const requestSchema = { name: String, at: Date, able: Boolean, age: Number, meta: Object, many: Array }
        const scm = schema(requestSchema)
        const request = { name: "jhon", able: true, age: 50, meta: {} }
        // when
        const ret = scm.validate(request)
        // then
        assert.strictEqual(ret, true)
    })

    it('should validate request (partial - more keys on request)', () => {
        // given
        const requestSchema = { name: String, at: Date, age: Number, many: Array }
        const scm = schema(requestSchema)
        const request = { name: "jhon", at: new Date('2001-01-01'), able: true, age: 50, meta: {}, many: [1, 2] }
        // when
        const ret = scm.validate(request)
        // then
        assert.strictEqual(ret, false)
        assert.deepStrictEqual(scm.errors, [{ able: [{ invalidKey: true }] }, { meta: [{ invalidKey: true }] }])
    })

    it('should validate request (empty)', () => {
        // given
        const requestSchema = { name: String, at: Date, able: Boolean, age: Number, meta: Object, many: Array }
        const scm = schema(requestSchema)
        const request = {}
        // when
        const ret = scm.validate(request)
        // then
        assert.strictEqual(ret, true)
    })

    it('should validate request (arrays)', () => {
        // given
        const descSchema = { name: [String], at: [Date], able: [Boolean], age: [Number], meta: [Object], many: [Array] }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.strictEqual(ret, true)
    })

    describe('Number', () => {
        it('should validate number', () => {
            // given
            const requestSchema = { n: Number }
            const scm = schema(requestSchema)
            const request = { n: 1 }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, true)
        })

        it('should validate number (wrong)', () => {
            // given
            const requestSchema = { n: Number }
            const scm = schema(requestSchema)
            const request = { n: '1' }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, false)
            assert.deepStrictEqual(scm.errors, [{ n: [{ wrongType: 'Number' }] }])
        })
    })

    describe('String', () => {

        it('should validate string', () => {
            // given
            const requestSchema = { s: String }
            const scm = schema(requestSchema)
            const request = { s: 'a' }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, true)
        })

        it('should validate string (wrong)', () => {
            // given
            const requestSchema = { s: String }
            const scm = schema(requestSchema)
            const request = { s: 1 }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, false)
            assert.deepStrictEqual(scm.errors, [{ s: [{ wrongType: 'String' }] }])
        })
    })

    describe('Boolean', () => {

        it('should validate boolean', () => {
            // given
            const requestSchema = { b: Boolean }
            const scm = schema(requestSchema)
            const request = { b: false }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, true)
        })

        it('should validate boolean (wrong)', () => {
            // given
            const requestSchema = { b: Boolean }
            const scm = schema(requestSchema)
            const request = { b: 1 }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, false)
            assert.deepStrictEqual(scm.errors, [{ b: [{ wrongType: 'Boolean' }] }])
        })
    })

    describe('Date', () => {

        it('should validate date', () => {
            // given
            const requestSchema = { d: Date }
            const scm = schema(requestSchema)
            const request = { d: new Date() }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, true)
        })

        it('should validate date (wrong)', () => {
            // given
            const requestSchema = { d: Date }
            const scm = schema(requestSchema)
            const request = { d: 1 }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, false)
            assert.deepStrictEqual(scm.errors, [{ d: [{ wrongType: 'Date' }] }])
        })
    })

    describe('Object', () => {

        it('should validate object', () => {
            // given
            const requestSchema = { o: Object }
            const scm = schema(requestSchema)
            const request = { o: new Object() }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, true)
        })

        it('should validate object (wrong)', () => {
            // given
            const requestSchema = { o: Object }
            const scm = schema(requestSchema)
            const request = { o: 1 }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, false)
            assert.deepStrictEqual(scm.errors, [{ o: [{ wrongType: 'Object' }] }])
        })
    })

    describe('Array', () => {

        it('should validate array', () => {
            // given
            const requestSchema = { a: Array }
            const scm = schema(requestSchema)
            const request = { a: [] }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, true)
        })

        it('should validate array (wrong)', () => {
            // given
            const requestSchema = { a: Array }
            const scm = schema(requestSchema)
            const request = { a: 1 }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, false)
            assert.deepStrictEqual(scm.errors, [{ a: [{ wrongType: 'Array' }] }])
        })
    })

    describe('Entity', () =>{

        it('should validate entity', () => {
            // given
            const anEntity = entity('anEntiy',{
                stringField: field(String),
                numberField: field(Number)
            })

            const requestSchema = { o: anEntity }
            const scm = schema(requestSchema)
            const request = { o: new anEntity() }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, true)
        })

        it('should validate entity outside base entity', () => {
            // given

            const anEntity = entity('anEntiy',{
                stringField: field(String),
                numberField: field(Number)
            })

            const anGenericEntity = class{}

            const requestSchema = { o: anEntity }
            const scm = schema(requestSchema)
            const request = { o: new anGenericEntity() }
            // when
            const ret = scm.validate(request)
            // then
            assert.strictEqual(ret, false)
            assert.deepStrictEqual(scm.errors, [{ o: [{ wrongType: 'anEntiy' }] }])
        })
    })

    describe('Not installed Gotu optional dependency', () =>{

        it('should not validate entity when gotu is not installed', () => {
            // given uninstalled context
            const baseEntityPath = require.resolve('@herbsjs/gotu/src/baseEntity')
            const tempPath = baseEntityPath.replace('baseEntity.js','baseEntity_temp')
            const storedCache = require.cache[baseEntityPath]
            fs.renameSync(baseEntityPath,tempPath)
            delete require.cache[baseEntityPath]

            // when
            const anEntity = entity('anEntiy',{
                stringField: field(String),
                numberField: field(Number)
            })

            const requestSchema = { o: anEntity }
            const scm = schema(requestSchema)

            const request = { o: anEntity.fromJSON({stringField: 'string', numberField: 1234}) }
            const ret = scm.validate(request)

            //undo uninstall
            fs.renameSync(tempPath, baseEntityPath)
            require.cache[baseEntityPath] = storedCache

            //then assert
            assert.strictEqual(ret, false)
            assert.deepStrictEqual(scm.errors, [{ o: [{ invalidType: anEntity.prototype.constructor }] }])            

        })
    })
})


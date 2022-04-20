const assert = require('assert')
const fs = require('fs')
const {entity, field} = require('@herbsjs/gotu')

const { schema } = require('../../../src/schema')

describe('Schema validation',  () => {

    it('should create schema (flat and simple)',  () => {
        // given
        const anEntity = entity('anEntiy',{
            stringField: field(String),
            numberField: field(Number)
        })

        const descSchema = { name: String, at: Date, able: Boolean, age: Number, meta: Object, many: Array, entity: anEntity }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.strictEqual(ret, true)
    })

    it('should create schema (arrays)',  () => {
        // given
        const anEntity = entity('anEntiy',{
            stringField: field(String),
            numberField: field(Number)
        })

        const descSchema = { name: [String], at: [Date], able: [Boolean], age: [Number], meta: [Object], many: [Array], entity: [anEntity] }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.strictEqual(ret, true)
    })

    it('should not create schema (wrong value)',  () => {
        // given
        const descSchema = { name: 'Polly' }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.strictEqual(ret, false)
        assert.deepStrictEqual(scm.errors, [{ name: [{ invalidType: 'Polly' }] }])
    })

    it('should not create schema (wrong value array)',  () => {
        // given
        const descSchema = { name: ['Polly'] }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.strictEqual(ret, false)
        assert.deepStrictEqual(scm.errors, [{ name: [{ invalidType: ['Polly'] }] }])
    })

    it('should not create schema (wrong value in array)',  () => {
        // given
        const descSchema = { legs: [10] }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.strictEqual(ret, false)
        assert.deepStrictEqual(scm.errors, [{ legs: [{ invalidType: [10] }] }])
    })

    it('should not create schema (empty value)',  () => {
        // given
        const emptySchema = undefined
        const scm = schema(emptySchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.strictEqual(ret, false)
        assert.deepStrictEqual(scm.errors, [{ notDefined: true }])
    })

    it('should not create schema (deep nesting)',  () => {
        // given
        const descSchema = {
            meta: { info: { data: { important: { thing: Boolean } } } }
        }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.strictEqual(ret, false)
    })


    it('should not create schema with entity when gotu is not installed',  () => {
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

        const descSchema = { entity: anEntity, manyEntity: [anEntity] }
        const scm = schema(descSchema)
        const ret = scm.validateSchema()


            //undo uninstall
        fs.renameSync(tempPath, baseEntityPath)
        require.cache[baseEntityPath] = storedCache

        //then assert
        assert.strictEqual(ret, false)
    })
})

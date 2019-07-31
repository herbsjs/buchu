const { schema } = require('../../../src/schema');
const assert = require('assert')

describe('Schema validation', function () {

    it('should create schema (flat and simple)', function () {
        // given
        const descSchema = { name: String, at: Date, able: Boolean, age: Number, meta: Object, many: Array }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.equal(ret, true)
    });

    it('should create schema (arrays)', function () {
        // given
        const descSchema = { name: [String], at: [Date], able: [Boolean], age: [Number], meta: [Object], many: [Array] }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.equal(ret, true)
    });

    it('should not create schema (wrong value)', function () {
        // given
        const descSchema = { name: 'Polly' }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.equal(ret, false)
        assert.equal(scm.errors[0].isErr, true)
    });

    it('should not create schema (wrong value array)', function () {
        // given
        const descSchema = { name: ['Polly'] }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.equal(ret, false)
        assert.equal(scm.errors[0].isErr, true)
    });

    it('should not create schema (wrong value in array)', function () {
        // given
        const descSchema = { legs: [10] }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.equal(ret, false)
        assert.equal(scm.errors[0].isErr, true)
    });

    it('should not create schema (deep nesting)', function () {
        // given
        const descSchema = {
            meta: { info: { data: { important: { thing: Boolean } } } }
        }
        const scm = schema(descSchema)
        // when
        const ret = scm.validateSchema()
        // then
        assert.equal(ret, false)
    });
});
const assert = require('assert')
const { request } = require('../../src/request')
const { entity, field, id }  = require('@herbsjs/gotu')

const anEntity = entity('anEntiy',{
    id: id(Number),
    stringField: field(String)    
})

const anEntityWithEntityField = entity('anEntityWithEntityField',{
    id: id(Number),
    stringField: field(String),
    entityField: field(anEntity)
})

describe('Request from', () => {
    it('should extract class schema with whole structure', () => {
        //given
        const schemaExpected = {
            stringField: String, 
            id: Number
        }

        //when
        const requestResult = request.from(anEntity)

        //then
        assert.deepEqual(requestResult, schemaExpected)        
    }),

    it('should extract class schema with with entity as a field', () => {
        //given
        const entityFieldType = field(anEntity).type
        const schemaExpected = {
            id: Number,
            stringField: String, 
            entityField: entityFieldType
        }

        //when
        const requestResult = request.from(anEntityWithEntityField)

        //then
        assert.deepEqual(requestResult, schemaExpected)        
    }),

    it('should throw error when trying to transform an object without constructor', () => {
        //given
        const emptyObject = {}

        //then
        assert.throws(() => request.from(emptyObject), Error)
    }),

    it('should throw error when trying to transform class without schema', () => {
        //given
        class AClass {}

        //then
        assert.throws(() => request.from(AClass), Error)
    })

    it('should remove IDs from main schema when ignoreIDs is true on settings', () => {
        //given
        const schemaExpected = {
            stringField: String
        }

        //when
        const settings = { ignoreIDs : true }
        const requestResult = request.from(anEntity, settings)

        //then
        assert.deepEqual(requestResult, schemaExpected)        
    }),

    it('should remove property from main schema when setted on ignore array', () => {
        //given
        const schemaExpected = {
            id: Number
        }

        //when
        const settings = { ignore: ['stringField'] }
        const requestResult = request.from(anEntity, settings)

        //then
        assert.deepEqual(requestResult, schemaExpected)        
    }),

    it('should remove entity as property from main schema when setted on ignore array', () => {
        //given
        const schemaExpected = {
            id: Number,
            stringField: String
        }

        //when
        const settings = { ignore: ['entityField'] }
        const requestResult = request.from(anEntityWithEntityField, settings)

        //then
        assert.deepEqual(requestResult, schemaExpected)        
    }),

    it('should work with both settings ignoreIDs and ignore setted up', () => {
        //given
        const schemaExpected = {
            stringField: String
        }

        //when
        const settings = { ignoreIDs: true, ignore: ['entityField'] }
        const requestResult = request.from(anEntityWithEntityField, settings)

        //then
        assert.deepEqual(requestResult, schemaExpected)        
    })
})

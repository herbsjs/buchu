const assert = require('assert')

const { Ok } = require('../../src/results')
const stringToCamelCase = require('../../src/helpers/stringToCamelCase')

describe('Helpers - stringToCamelCase', () => {
  describe('with common expected strings', () => {
    it('Should convert a common phrase', () => {
      // given
      const value = "My Common Description"

      // when
      const ret = stringToCamelCase(value)

      // then
      assert.deepStrictEqual(ret, 'myCommonDescription')
    })

    it('Should convert a common phrase with numbers', () => {
      // given
      const value = "My Common Description 123"

      // when
      const ret = stringToCamelCase(value)

      // then
      assert.deepStrictEqual(ret, 'myCommonDescription123')
    })

    
    it('Should convert a common phrase with two spaces', () => {
      // given
      const value = "My Common  Description"

      // when
      const ret = stringToCamelCase(value)

      // then
      assert.deepStrictEqual(ret, 'myCommonDescription')
    })
   
  })

  describe('with unexpected structures', () => {
    it('Should ignore if object', () => {
      // given
      const value = {}

      // when
      const ret = stringToCamelCase(value)

      // then
      assert.deepStrictEqual(ret, undefined)
    })

    it('Should ignore if numbers', () => {
      // given
      const value = 123

      // when
      const ret = stringToCamelCase(value)

      // then
      assert.deepStrictEqual(ret, undefined)
    })
    
    it('Should ignore if emptystring', () => {
      // given
      const value = ''

      // when
      const ret = stringToCamelCase(value)

      // then
      assert.deepStrictEqual(ret, undefined)
    })

    it('Should ignore if null', () => {
      // given
      const value = null

      // when
      const ret = stringToCamelCase(value)

      // then
      assert.deepStrictEqual(ret, undefined)
    })

    it('Should ignore if undefined', () => {
      // given
      const value = undefined

      // when
      const ret = stringToCamelCase(value)

      // then
      assert.deepStrictEqual(ret, undefined)
    })
  })
})

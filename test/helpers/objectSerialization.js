const assert = require('assert')

const { Ok } = require('../../src/results')
const objectSerialization = require('../../src/helpers/objectSerialization')

describe('Helpers - pullOutValue', () => {

  it('Should pull out only the values from Ok instance', () => {
    // given
    const values = {
      investors: [{
        name: 'John Doe',
        age: 27,
        job: 'Entrepeneur'
      }, {
        name: 'Jane Doe',
        age: 23,
        job: 'Designer'
      }]
    }
    const ret = Ok(values)

    // when
    const payload = objectSerialization(ret)

    // then
    assert.deepStrictEqual(payload.Ok, values)
  })

  describe('on single values', () => {
    it('Should return a single number if a single number is gave', () => {
      // given
      const value = 10
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(typeof payload.Ok, 'number')
      assert.deepStrictEqual(payload.Ok, value)
    })

    it('Should return a single string if a single string is gave', () => {
      // given
      const value = 'investors'
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(typeof payload.Ok, 'string')
      assert.deepStrictEqual(payload.Ok, value)
    })

    it('Should return a single boolean if a single boolean is gave', () => {
      // given
      const value = true
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(typeof payload.Ok, 'boolean')
      assert.deepStrictEqual(payload.Ok, value)
    })
  })

  describe('on object values', () => {
    it('Should return an object if an object is gave', () => {
      // given
      const value = {
        name: 'John Doe',
        age: 27,
        skills: { hardskill: 'Architect', softskill: 'Sociable' },
        isInvestor: true,
        markets: ['Nasdaq','B3','TSX']
      }
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(typeof payload.Ok, 'object')
      assert.deepStrictEqual(payload.Ok, value)
    })

    it('Should keep the same values and types of the given object', () => {
      // given
      const value = {
        name: 'John Doe',
        age: 27,
        skills: { hardskill: 'Architect', softskill: 'Sociable' },
        isInvestor: true,
        markets: ['Nasdaq','B3','TSX']
      }
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(typeof payload.Ok, 'object')
      assert.deepStrictEqual(payload.Ok, value)

      assert.deepStrictEqual(typeof payload.Ok.name, 'string')
      assert.deepStrictEqual(payload.Ok.name, value.name)

      assert.deepStrictEqual(typeof payload.Ok.age, 'number')
      assert.deepStrictEqual(payload.Ok.age, value.age)

      assert.deepStrictEqual(typeof payload.Ok.isInvestor, 'boolean')
      assert.deepStrictEqual(payload.Ok.isInvestor, value.isInvestor)

      assert.deepStrictEqual(typeof payload.Ok.skills, 'object')
      assert.deepStrictEqual(payload.Ok.skills, value.skills)

      assert.deepStrictEqual(Array.isArray(payload.Ok.markets), true)
      assert.deepStrictEqual(payload.Ok.markets, value.markets)
    })
  })

  describe('on array values', () => {
    it('Should return an array if an array is gave', () => {
      // given
      const value = ['Nasdaq','B3','TSX']
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(Array.isArray(payload.Ok), true)
      assert.deepStrictEqual(payload.Ok, value)
    })

    it('Should keep the same values and types of the given array', () => {
      // given
      const value = [
        'Nasdaq',
        180,
        true, 
        { hardskill: 'Architect', softskill: 'Sociable' },
        [1,2,3]
      ]
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(Array.isArray(payload.Ok), true)
      assert.deepStrictEqual(payload.Ok, value)

      assert.deepStrictEqual(typeof payload.Ok[0], 'string')
      assert.deepStrictEqual(payload.Ok[0], value[0])

      assert.deepStrictEqual(typeof payload.Ok[1], 'number')
      assert.deepStrictEqual(payload.Ok[1], value[1])

      assert.deepStrictEqual(typeof payload.Ok[2], 'boolean')
      assert.deepStrictEqual(payload.Ok[2], value[2])

      assert.deepStrictEqual(typeof payload.Ok[3], 'object')
      assert.deepStrictEqual(payload.Ok[3], value[3])

      assert.deepStrictEqual(Array.isArray(payload.Ok[4]), true)
      assert.deepStrictEqual(payload.Ok[4], value[4])
    })

    it('Should return an array with only numbers if an array with only numbers is gave', () => {
      // given
      const value = [180, 360, 720]
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(Array.isArray(payload.Ok), true)
      assert.deepStrictEqual(payload.Ok.every(element => typeof element === 'number'), true)
    })

    it('Should return an array with only string if an array with only string is gave', () => {
      // given
      const value = ['Nasdaq','B3','TSX']
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(Array.isArray(payload.Ok), true)
      assert.deepStrictEqual(payload.Ok.every(element => typeof element === 'string'), true)
    })

    it('Should return an array with only objects if an array with only objects is gave', () => {
      // given
      const value = [ 
        { marketName: 'Nasdaq' },
        { marketName: 'B3' },
        { marketName: 'TSX' }
      ]
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(Array.isArray(payload.Ok), true)
      assert.deepStrictEqual(payload.Ok.every(element => typeof element === 'object'), true)
    })
  })

  describe('on falsy values', () => {
    it('Should return a null if a null is gave', () => {
      // given
      const value = null
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(payload.Ok, null)
    })

    it('Should return an empty value if an empty value is gave', () => {
      // given
      const value = ''
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(payload.Ok, '')
    })

    it('Should return an empty value if undefined value is gave', () => {
      // given
      const value = undefined
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(payload.Ok, '')
    })
  })

  describe('on values with circular structures', () => {
    it('Should return the correct value when an object with circular structure is gave', () => {
      // given
      let value = { rows: [1, 2, 3] }
      value.value = value
      const ret = Ok(value)

      // when
      const payload = objectSerialization(ret)

      // then
      assert.deepStrictEqual(payload.Ok, { rows: [1, 2, 3] })
    })
  })
})

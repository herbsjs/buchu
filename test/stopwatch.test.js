const assert = require('assert')
const stopwatch = require('../src/stopwatch')

describe('stopwatch validator', () => {
  it('should return log time', () => {
    const aboveTime = 1000
    let elapsedTime = 0

    stopwatch.start()
    setTimeout(function () {
      
      elapsedTime = stopwatch.stop().time
      assert.notEqual(elapsedTime, undefined)

      if (!elapsedTime > 0) assert.ok(false)
    }, aboveTime)
  })

  it('should return log time for a named clock', () => {
    const aboveTime = 1200
    let elapsedTime = 0
    const clockName = 'buchu'

    stopwatch.start(clockName)

    setTimeout(function () {

      elapsedTime = stopwatch.stop().time
      assert.notEqual(elapsedTime, undefined)

      if (!elapsedTime > 0) assert.ok(false)
    }, aboveTime)
  })

})

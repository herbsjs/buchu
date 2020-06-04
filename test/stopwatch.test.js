const chai = require('chai')
const assert = chai.assert
const stopwatch = require('../src/stopwatch')

describe('stopwatch validator', () => {
  it('start should be a method', () => {
    assert.ok(stopwatch.start)
  })

  it('stop should be a method', () => {
    assert.ok(stopwatch.stop)
  })

  it('should return log time', () => {
    const aboveTime = 1000
    const runTime = 950
    stopwatch.start()

    setTimeout(function () {
      assert.isAbove(stopwatch.stop().time, runTime)
    }, aboveTime)
  })

  it('should return log time for a named clock', () => {
    const aboveTime = 1200
    const runTime = 1150
    const clockName = 'buchu'

    stopwatch.start(clockName)

    setTimeout(function () {
      assert.isAbove(stopwatch.stop(clockName).time, runTime)
    }, aboveTime)
  })
 

  it('should return error for stop a not started clock', () => {

    expected = Error
    const clockName = 'herbsjs'

    const ret = () => stopwatch.stop(clockName)

    assert.throws(ret, expected)

    })
})

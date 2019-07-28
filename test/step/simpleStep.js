const { step } = require('../../src/step')
const { Ok, Err } = require('../../src/results')
const assert = require('assert')

describe('A step', () => {

    describe('with a function (simplest step)', () => {

        describe('returning Ok', () => {

            const givenTheSimplestStep = () => {
                const st = step(() => { return Ok() })
                return st
            }

            it('should run', () => {
                //given
                const st = givenTheSimplestStep()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isOk)
            })
        })

        describe('returning Err', () => {

            const givenTheSimplestStepWithError = () => {
                const st = step(() => { return Err() })
                return st
            }

            it('should run', () => {
                //given
                const st = givenTheSimplestStepWithError()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isErr)
            })
        })
    })
})
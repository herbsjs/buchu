const { usecase } = require('../../src/usecase')
const { ifElse } = require('../../src/ifElse')
const { step } = require('../../src/step')
const { Ok, Err } = require('../../src/results')
const assert = require('assert')

describe('If Else step', () => {

    describe('on a use case', () => {
        const givenASimpleUseCase = () => {
            const uc = usecase('A use case', {
                'A condition': ifElse({
                    'If Step': step(() => { return Ok() }),
                    'Then Step': step(() => { return Ok() }),
                    'Else Step': step(() => { return Err() })
                })
            })
            return uc
        }

        it('should run', () => {
            //given
            const uc = givenASimpleUseCase()
            //when
            const ret = uc.run()
            //then
            assert.ok(ret.isOk)
        })
    })

    context('returning Ok from Then', () => {

        const givenAnIfElseStep = () => {
            const ifElseStep = ifElse({
                'If Step': step(() => { return Ok() }),
                'Then Step': step(() => { return Ok() }),
                'Else Step': step(() => { return Err() })
            })
            return ifElseStep
        }

        it('should run', () => {
            //given
            const st = givenAnIfElseStep()
            //when
            const ret = st.run()
            //then
            assert.ok(ret.isOk)
        })

        it('should doc', () => {
            //given
            const st = givenAnIfElseStep()
            //when
            const ret = st.doc()
            //then
            assert.deepEqual(ret, {
                if: {
                    description: 'If Step',
                    steps: null
                },
                then: {
                    description: 'Then Step',
                    steps: null
                },
                else: {
                    description: 'Else Step',
                    steps: null
                }
            })
        })
    })

    context('returning Ok from Else', () => {

        const givenAnIfElseStep = () => {
            const ifElseStep = ifElse({
                'If': step(() => { return Err() }),
                'Then': step(() => { return Err() }),
                'Else': step(() => { return Ok() })
            })
            return ifElseStep
        }

        it('should run', () => {
            //given
            const st = givenAnIfElseStep()
            //when
            const ret = st.run()
            //then
            assert.ok(ret.isOk)
        })
    })
})
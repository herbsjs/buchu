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

        it('should audit', () => {
            //given
            const st = givenASimpleUseCase()
            //when
            st.run()
            //then
            assert.deepEqual(st.auditTrail, {
                type: 'use case', description: 'A use case', return: Ok({}),
                steps: [
                    {
                        type: 'if else',
                        description: 'A condition',
                        returnIf: Ok(),
                        returnThen: Ok()
                    }
                ],
            })
        })
    })

    describe('on a use case with context', () => {
        const givenASimpleUseCaseWithContext = () => {
            const uc = usecase('A use case', {
                'A condition': ifElse({
                    'If Step': step((ctx) => { ctx.ret.IfStep = 10; return Ok() }),
                    'Then Step': step((ctx) => { ctx.ret.ThenStep = 20; return Ok() }),
                    'Else Step': step((ctx) => { ctx.ret.ElseStep = 30; return Err() })
                })
            })
            return uc
        }

        it('should run', () => {
            //given
            const uc = givenASimpleUseCaseWithContext()
            //when
            const ret = uc.run()
            //then
            assert.ok(ret.isOk)
            assert.deepEqual(ret.value, { IfStep: 10, ThenStep: 20 })
        })
    })

    describe('simple If Else Then', () => {

        context('returning Ok from Then', () => {

            const givenAnIfThenStep = () => {
                const ifElseStep = ifElse({
                    'If Step': step(() => { return Ok() }),
                    'Then Step': step(() => { return Ok() }),
                    'Else Step': step(() => { return Err() })
                })
                return ifElseStep
            }

            it('should run', () => {
                //given
                const st = givenAnIfThenStep()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', () => {
                //given
                const st = givenAnIfThenStep()
                //when
                st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    returnIf: Ok(),
                    returnThen: Ok()
                })
            })

            it('should doc', () => {
                //given
                const st = givenAnIfThenStep()
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

            it('should audit', () => {
                //given
                const st = givenAnIfElseStep()
                //when
                st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    returnIf: Err(),
                    returnElse: Ok()
                })
            })
        })
    })

    describe('If Else Then with with return value', () => {

        context('returning Ok from Then', () => {

            const givenAnIfThenStepWithReturn = () => {
                const ifElseStep = ifElse({
                    'If Step': step(() => { return Ok(1) }),
                    'Then Step': step(() => { return Ok(2) }),
                    'Else Step': step(() => { return Err(3) })
                })
                return ifElseStep
            }

            it('should run', () => {
                //given
                const st = givenAnIfThenStepWithReturn()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, 2)
            })
        })

        context('returning Ok from Else', () => {

            const givenAnIfElseStepWithReturn = () => {
                const ifElseStep = ifElse({
                    'If Step': step(() => { return Err(1) }),
                    'Then Step': step(() => { return Err(2) }),
                    'Else Step': step(() => { return Ok(3) })
                })
                return ifElseStep
            }

            it('should run', () => {
                //given
                const st = givenAnIfElseStepWithReturn()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, 3)
            })
        })
    })
})
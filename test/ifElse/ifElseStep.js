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
                    'If Step': step(() => { return Ok(true) }),
                    'Then Step': step(() => { return Ok() }),
                    'Else Step': step(() => { return Err() })
                }),
            })
            return uc
        }

        it('should run', async () => {
            //given
            const uc = givenASimpleUseCase()
            //when
            const ret = await uc.run()
            //then
            assert.ok(ret.isOk)
        })

        it('should audit', async () => {
            //given
            const uc = givenASimpleUseCase()
            //when
            await uc.run()
            //then
            assert.deepEqual(uc.auditTrail, {
                type: 'use case',
                description: 'A use case',
                transactionId: uc._mainStep._auditTrail.transactionId,
                elapsedTime: uc._mainStep._auditTrail.elapsedTime,
                return: Ok({}),
                steps: [
                    {
                        type: 'if else',
                        description: 'A condition',
                        returnIf: Ok(true),
                        returnThen: Ok(),
                        elapsedTime: uc._auditTrail.steps[0].elapsedTime,
                    },
                ],
            })
        })
    })

    describe('on a use case with context', () => {
        const givenASimpleUseCaseWithContext = () => {
            const uc = usecase('A use case', {
                'A condition': ifElse({
                    'If Step': step((ctx) => { ctx.ret.IfStep = 10; return Ok(true) }),
                    'Then Step': step((ctx) => { ctx.ret.ThenStep = 20; return Ok() }),
                    'Else Step': step((ctx) => { ctx.ret.ElseStep = 30; return Err() })
                }),
            })
            return uc
        }

        it('should run', async () => {
            //given
            const uc = givenASimpleUseCaseWithContext()
            //when
            const ret = await uc.run()
            //then
            assert.ok(ret.isOk)
            assert.deepEqual(ret.value, { IfStep: 10, ThenStep: 20 })
        })
    })

    describe('on a use case with request', () => {
        const givenASimpleUseCaseWithRequest = () => {
            const uc = usecase('A use case', {
                request: {
                    param1: Number,
                },
                'A condition': ifElse({
                    'If Step': step((ctx) => {
                        if (ctx.req.param1 == 1) return Ok(true)
                        if (ctx.req.param1 == 2) return Ok(false)
                        return Err()
                    }),
                    'Then Step': step((ctx) => { ctx.ret.return1 = 1; return Ok() }),
                    'Else Step': step((ctx) => { ctx.ret.return2 = 2; return Ok() })
                }),
            })
            return uc
        }

        it('should run - then', async () => {
            //given
            const uc = givenASimpleUseCaseWithRequest()
            //when
            const ret = await uc.run({ param1: 1 })
            //then
            assert.ok(ret.isOk)
            assert.equal(ret.value.return1, 1)
        })

        it('should run - else', async () => {
            //given
            const uc = givenASimpleUseCaseWithRequest()
            //when
            const ret = await uc.run({ param1: 2 })
            //then
            assert.ok(ret.isOk)
            assert.equal(ret.value.return2, 2)
        })

        it('should audit', async () => {
            //given
            const uc = givenASimpleUseCaseWithRequest()
            //when
            await uc.run({ param1: 1 })
            //then
            assert.deepEqual(uc.auditTrail, {
                type: 'use case',
                description: 'A use case',
                transactionId: uc._mainStep._auditTrail.transactionId,
                elapsedTime: uc._mainStep._auditTrail.elapsedTime,
                return: Ok({ return1: 1 }),
                steps: [
                    {
                        type: 'if else',
                        description: 'A condition',
                        returnIf: Ok(true),
                        returnThen: Ok(),
                        elapsedTime: uc._auditTrail.steps[0].elapsedTime,
                    },
                ],
            })
        })
    })

    describe('simple If Else Then', () => {
        context('returning Ok from Then', () => {
            const givenAnIfThenStep = () => {
                const ifElseStep = ifElse({
                    'If Step': step(() => { return Ok(true) }),
                    'Then Step': step(() => { return Ok() }),
                    'Else Step': step(() => { return Err() })
                })
                return ifElseStep
            }

            it('should run', async () => {
                //given
                const st = givenAnIfThenStep()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const st = givenAnIfThenStep()
                //when
                await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    returnIf: Ok(true),
                    returnThen: Ok(),
                })
            })

            it('should doc', () => {
                //given
                const st = givenAnIfThenStep()
                //when
                const ret = st.doc()
                //then
                assert.deepEqual(ret, {
                    type: 'if else',
                    if: {
                        type: 'step',
                        description: 'If Step',
                        steps: null,
                    },
                    then: {
                        type: 'step',
                        description: 'Then Step',
                        steps: null,
                    },
                    else: {
                        type: 'step',
                        description: 'Else Step',
                        steps: null,
                    },
                })
            })
        })

        context('returning Ok from Else', () => {
            const givenAnIfElseStep = () => {
                const ifElseStep = ifElse({
                    'If': step(() => { return Ok(false) }),
                    'Then': step(() => { return Err() }),
                    'Else': step(() => { return Ok() })
                })
                return ifElseStep
            }

            it('should run', async () => {
                //given
                const st = givenAnIfElseStep()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const st = givenAnIfElseStep()
                //when
                await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    returnIf: Ok(false),
                    returnElse: Ok(),
                })
            })
        })
    })

    describe('If Else Then with with return value', () => {
        context('returning Ok from Then', () => {
            const givenAnIfThenStepWithReturn = () => {
                const ifElseStep = ifElse({
                    'If Step': step(() => { return Ok(true) }),
                    'Then Step': step(() => { return Ok(2) }),
                    'Else Step': step(() => { return Err(3) })
                })
                return ifElseStep
            }

            it('should run', async () => {
                //given
                const st = givenAnIfThenStepWithReturn()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, 2)
            })
        })

        context('returning Ok from Else', () => {
            const givenAnIfElseStepWithReturn = () => {
                const ifElseStep = ifElse({
                    'If Step': step(() => { return Ok(false) }),
                    'Then Step': step(() => { return Err(2) }),
                    'Else Step': step(() => { return Ok(3) })
                })
                return ifElseStep
            }

            it('should run', async () => {
                //given
                const st = givenAnIfElseStepWithReturn()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, 3)
            })
        })
    })
})
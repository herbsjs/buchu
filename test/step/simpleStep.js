const { step } = require('../../src/step')
const { Ok, Err } = require('../../src/results')
const assert = require('assert')

describe('A step', () => {

    describe('with a function (simplest step)', () => {

        context('returning Ok', () => {

            const givenTheSimplestStep = () => {
                const st = step(() => { return Ok() })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStep()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, null)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStep()
                //when
                const ret = await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Ok()
                })
            })

            it('should doc', () => {
                //given
                const st = givenTheSimplestStep()
                //when
                const ret = st.doc()
                //then
                assert.deepEqual(ret, { description: undefined, steps: null })
            })
        })

        context('returning Err', () => {

            const givenTheSimplestStepWithError = () => {
                const st = step(() => { return Err() })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStepWithError()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
                assert.deepEqual(ret.value, null)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Err()
                })
            })
        })

        context('returning Exception', () => {

            const givenTheSimplestStepWithException = () => {
                const st = step(() => { throw new Error() })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStepWithException()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
                assert.ok(ret.err instanceof Error)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithException()
                //when
                const ret = await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Err(new Error())
                })
            })
        })
    })

    describe('with a function (simplest step) returning value', () => {

        context('returning Ok', () => {

            const givenTheSimplestStepReturningValue = () => {
                const st = step(() => { return Ok(1) })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStepReturningValue()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, 1)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepReturningValue()
                //when
                const ret = await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Ok(1)
                })
            })
        })

        context('returning Err', () => {

            const givenTheSimplestStepReturningValueWithError = () => {
                const st = step(() => { return Err(1) })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStepReturningValueWithError()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
                assert.deepEqual(ret.err, 1)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepReturningValueWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Err(1)
                })
            })
        })
    })

    describe('with a function (simplest step) and context', () => {

        context('returning Ok', () => {

            const givenTheSimplestStepWithContext = () => {
                const st = step((ctx) => { ctx.ret.step1 = 1; return Ok() })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStepWithContext()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, null)
                assert.deepEqual(st.context.ret, { step1: 1 })
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithContext()
                //when
                await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Ok()
                })
            })
        })

        context('returning Err', () => {

            const givenTheSimplestStepWithContextWithError = () => {
                const st = step((ctx) => { ctx.ret.step1 = 1; return Err() })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStepWithContextWithError()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
                assert.deepEqual(ret.value, null)
                assert.deepEqual(st.context.ret, { step1: 1 })
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithContextWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Err()
                })
            })
        })
    })

    describe('with a async function (simplest step)', () => {

        context('returning Ok', () => {

            const givenTheSimplestAsyncStep = () => {
                const st = step(async () => { return Ok() })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestAsyncStep()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, null)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestAsyncStep()
                //when
                const ret = await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Ok()
                })
            })
        })

        context('returning Err', () => {

            const givenTheSimplestAsyncStepWithError = () => {
                const st = step(() => { return Err() })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestAsyncStepWithError()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
                assert.deepEqual(ret.value, null)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestAsyncStepWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Err()
                })
            })
        })
    })
})
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
                assert.deepStrictEqual(ret.err, null)
                assert.deepStrictEqual(ret.value, undefined)
            })

            it('should check toString() function', async () => {
                //given
                const st = givenTheSimplestStep()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(ret.toString(), "Ok")
            })

            it('should check toJSON() function', async () => {
                //given
                const st = givenTheSimplestStep()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(ret.toJSON(), { Ok: '' })
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStep()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Ok: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

            it('should doc', () => {
                //given
                const st = givenTheSimplestStep()
                //when
                const ret = st.doc()
                //then
                assert.deepStrictEqual(ret, { type: "step", description: undefined, steps: null })
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
                assert.deepStrictEqual(ret.ok, null)
                assert.deepStrictEqual(ret.value, undefined)
            })

            it('should check toString() function', async () => {
                //given
                const st = givenTheSimplestStepWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(ret.toString(), "Error")
            })

            it('should check toJSON() function', async () => {
                //given
                const st = givenTheSimplestStepWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(ret.toJSON(), { Error: '' })
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithError()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Error: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })

        context('returning nothing', () => {

            const givenTheSimplestStepWithNoReturn = () => {
                const st = step(() => { })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStepWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(ret, Ok())
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithNoReturn()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Ok: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })

        context('returning Exception when production', () => {

            beforeEach((done) => {
                process.env.HERBS_EXCEPTION = "audit"
                done()
            })

            const givenTheSimplestStepWithException = () => {
                class MyError extends Error {
                    constructor(message) {
                        super(message)
                        this.name = 'MyError'
                    }
                }
                const st = step(() => { throw new MyError('An error XYZ') })
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
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Error: 'MyError: An error XYZ' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

            afterEach((done) => {
                process.env.HERBS_EXCEPTION = null
                done()
            })

        })

        context('throwing Exception when not production', () => {

            beforeEach((done) => {
                process.env.HERBS_EXCEPTION = "dev"
                done()
            })

            const givenTheSimplestStepWithException = () => {
                const st = step(() => { throw new Error() })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenTheSimplestStepWithException()
                //when
                const f = async () => { const ret = await st.run() }
                //then
                assert.rejects(f(), Error)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithException()
                //when
                try { await st.run() }
                catch (e) { }
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: ''
                })
            })

            afterEach((done) => {
                process.env.HERBS_EXCEPTION = null
                done()
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
                assert.deepStrictEqual(ret.value, 1)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepReturningValue()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Ok: 1 }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })

        context('returning a value', () => {

            const givenTheSimplestStepReturningValue = (value) => {
                const st = step(() => { return value })

                return st
            }

            context('returning a integer', () => {

                it('should run', async () => {
                    //given
                    const st = givenTheSimplestStepReturningValue(1)
                    //when
                    const ret = await st.run()
                    //then
                    assert.strictEqual(ret, 1)
                })

                it('should audit', async () => {
                    //given
                    const st = givenTheSimplestStepReturningValue(1)
                    //when
                    const ret = await st.run()
                    //then
                    assert.deepStrictEqual(st.auditTrail, {
                        type: 'step',
                        description: undefined,
                        elapsedTime: st.auditTrail.elapsedTime,
                        return: 1
                    })
                    assert.ok(st.auditTrail.elapsedTime > 0)
                })
            })

            context('returning a array', () => {

                it('should run', async () => {
                    //given
                    const st = givenTheSimplestStepReturningValue([1])
                    //when
                    const ret = await st.run()
                    //then
                    assert.deepStrictEqual(ret, [1])
                })

                it('should audit', async () => {
                    //given
                    const st = givenTheSimplestStepReturningValue([1])
                    //when
                    const ret = await st.run()
                    //then
                    assert.deepStrictEqual(st.auditTrail, {
                        type: 'step',
                        description: undefined,
                        elapsedTime: st.auditTrail.elapsedTime,
                        return: [1]
                    })
                    assert.ok(st.auditTrail.elapsedTime > 0)
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
                assert.deepStrictEqual(ret.err, 1)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepReturningValueWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Error: 1 }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
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
                assert.deepStrictEqual(ret.value, undefined)
                assert.deepStrictEqual(st.context.ret, { step1: 1 })
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithContext()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Ok: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
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
                assert.deepStrictEqual(ret.err, undefined)
                assert.deepStrictEqual(st.context.ret, { step1: 1 })
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestStepWithContextWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Error: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
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
                assert.deepStrictEqual(ret.value, undefined)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestAsyncStep()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Ok: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
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
                assert.deepStrictEqual(ret.err, undefined)
            })

            it('should audit', async () => {
                //given
                const st = givenTheSimplestAsyncStepWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Error: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })
    })
})
const { usecase } = require('../../src/usecase')
const { step } = require('../../src/step')
const { Ok, Err } = require('../../src/results')
const assert = require('assert')

describe('A use case', () => {

    describe('the simplest use case', () => {

        const givenTheSimplestUseCase = () => {
            const uc = usecase('A use case', {
                'A step': step(() => { return Ok() }),
                'A second step': step({
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Ok() }),
                })
            })
            return uc
        }

        it('should initiate', () => {
            //given
            const uc = givenTheSimplestUseCase()
            //then
            assert.ok(uc.description == 'A use case')
        })

        context('returning Ok', () => {

            it('should run', async () => {
                //given
                const uc = givenTheSimplestUseCase()
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const uc = givenTheSimplestUseCase()
                //when
                await uc.run()
                //then
                assert.deepEqual(uc.auditTrail, {
                    type: 'use case',
                    description: 'A use case',
                    transactionId: uc._mainStep._auditTrail.transactionId,
                    return: Ok({}),
                    steps: [
                        { type: 'step', description: 'A step', return: Ok() },
                        {
                            type: 'step', description: 'A second step', return: Ok({}), steps: [
                                { type: 'step', description: 'step 1', return: Ok() },
                                { type: 'step', description: 'step 2', return: Ok() }
                            ]
                        }]
                })
            })

            it('should doc', () => {
                //given
                const uc = givenTheSimplestUseCase()
                //when
                const ret = uc.doc()
                //then
                assert.deepEqual(ret, {
                    type: "use case",
                    description: "A use case",
                    steps: [
                        { type: "step", description: "A step", steps: null },
                        {
                            type: "step",
                            description: 'A second step',
                            steps: [
                                { type: "step", description: 'step 1', steps: null },
                                { type: "step", description: 'step 2', steps: null }
                            ]
                        }
                    ]
                })
            })
        })

        context('returning Err', () => {

            const givenTheSimplestUseCaseWithError = () => {
                const uc = usecase('A use case', {
                    'A misstep': step(() => { return Err() })
                })
                return uc
            }

            it('should run', async () => {
                //given
                const uc = givenTheSimplestUseCaseWithError()
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isErr)
            })
        })
    })

    describe('the simplest use case with context', () => {

        const givenTheSimplestUseCaseWithContext = () => {
            const uc = usecase('A use case', {
                'Change context': step({
                    'step c1': step((ctx) => { ctx.step1 = 1; return Ok() }),
                    'step c2': step((ctx) => { ctx.step2 = "2"; return Ok() }),
                }),
                'Change return': step({
                    'step r1': step((ctx) => { ctx.ret.step1 = "ret1"; return Ok() }),
                    'step r2': step((ctx) => { ctx.ret.step2 = "ret2"; return Ok() }),
                })
            })
            return uc
        }

        it('should initiate', () => {
            //given
            const uc = givenTheSimplestUseCaseWithContext()
            //then
            assert.deepEqual(uc.description, 'A use case')
        })

        context('returning Ok', () => {

            it('should run', async () => {
                //given
                const uc = givenTheSimplestUseCaseWithContext()
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isOk)
                assert.deepEqual(ret.value, { step1: 'ret1', step2: 'ret2' })
            })

            it('should audit', async () => {
                //given
                const uc = givenTheSimplestUseCaseWithContext()
                //when
                await uc.run()
                //then
                assert.deepEqual(uc.auditTrail, {
                    type: 'use case', description: 'A use case',
                    transactionId: uc._mainStep._auditTrail.transactionId,
                    return: Ok({ step1: 'ret1', step2: 'ret2' }), steps: [
                        {
                            type: 'step', description: 'Change context', return: Ok({}), steps: [
                                { type: 'step', description: 'step c1', return: Ok() },
                                { type: 'step', description: 'step c2', return: Ok() }
                            ]
                        },
                        {
                            type: 'step', description: 'Change return', return: Ok({ step1: 'ret1', step2: 'ret2' }), steps: [
                                { type: 'step', description: 'step r1', return: Ok() },
                                { type: 'step', description: 'step r2', return: Ok() }
                            ]
                        }]
                })
            })
        })
    })

    describe('the simplest use case with request', () => {

        const givenTheSimplestUseCaseWithRequest = () => {
            const uc = usecase('A use case', {
                request: {
                    param1: String,
                    param2: Number
                },
                'A step': step((ctx) => {
                    ctx.ret.response3 = ctx.req.param2 + 1
                    return Ok()
                })
            })
            return uc
        }

        it('should run', async () => {
            //given
            const uc = givenTheSimplestUseCaseWithRequest()
            //when
            const ret = await uc.run({ param1: "a", param2: 2 })
            //then
            assert.ok(ret.isOk)
            assert.deepEqual(ret.value, { response3: 3 })
        })

        it('should audit', async () => {
            //given
            const uc = givenTheSimplestUseCaseWithRequest()
            //when
            await uc.run({ param1: "a", param2: 2 })
            //then
            assert.deepEqual(uc.auditTrail, {
                type: 'use case',
                description: 'A use case',
                transactionId: uc._mainStep._auditTrail.transactionId,
                return: Ok({ response3: 3 }),
                steps: [
                    { type: 'step', description: 'A step', return: Ok() }]
            })
        })

        it('should doc', () => {
            //given
            const uc = givenTheSimplestUseCaseWithRequest()
            //when
            const ret = uc.doc()
            //then
            assert.deepEqual(ret, {
                request: {
                    param1: String,
                    param2: Number
                },
                type: "use case", 
                description: "A use case",
                steps: [
                    { type: "step", description: "A step", steps: null }
                ]
            })
        })

        it('should not run with invalid request value', async () => {
            //given
            const uc = givenTheSimplestUseCaseWithRequest()
            //when
            const ret = await uc.run({ param1: 10, param2: "x" })
            //then
            assert.ok(ret.isErr)
            assert.equal(ret.err.length, 2)
            assert.equal(ret.err[0].err.type, 'invalid value')
        })

        it('should not run with invalid request schema', async () => {

            const givenTheSimplestUseCaseWithInvalidRequest = () => {
                const uc = usecase('A use case', {
                    request: {
                        param1: "String",
                        param2: "Number"
                    },
                    'A step': step(() => { return Ok() })
                })
                return uc
            }

            //given
            const uc = givenTheSimplestUseCaseWithInvalidRequest()
            //when
            const ret = await uc.run({ param1: "a", param2: 2 })
            //then
            assert.ok(ret.isErr)
            assert.equal(ret.err.length, 2)
            assert.equal(ret.err[0].err.type, 'invalid schema')
        })

        it('should not run without request schema', async () => {

            const givenTheSimplestUseCaseWithNoRequest = () => {
                const uc = usecase('A use case', {
                    'A step': step(() => { return Ok() })
                })
                return uc
            }

            //given
            const uc = givenTheSimplestUseCaseWithNoRequest()
            //when
            const ret = await uc.run({ param1: "a", param2: 2 })
            //then
            assert.ok(ret.isErr)
            assert.equal(ret.err.length, 1)
            assert.equal(ret.err[0].type, 'invalid schema')
        })
    })

    describe('the simplest use case with setup function', () => {

        const givenTheSimplestUseCaseWithSetupFunction = () => {
            const uc = usecase('A use case', {
                setup: (ctx) => ctx.ret.step1 = 1,
                'Change return': step(() => Ok())
            })
            return uc
        }

        it('should initiate', () => {
            //given
            const uc = givenTheSimplestUseCaseWithSetupFunction()
            //then
            assert.deepEqual(uc.description, 'A use case')
        })

        it('should run with default value', async () => {
            //given
            const uc = givenTheSimplestUseCaseWithSetupFunction()
            //when
            const ret = await uc.run()
            //then
            assert.ok(ret.isOk)
            assert.deepEqual(ret.value, { step1: 1 })
        })
    })

    describe('the simplest use case with authorization', () => {

        const givenTheSimplestUseCaseWithAuthorization = () => {
            const uc = usecase('A use case', {
                authorize: (user) => { return user.isAdmin ? Ok() : Err() },
                'Step 1': step(() => { return Ok() })
            })
            return uc
        }

        context('with access', () => {

            it('should initiate', () => {
                //given
                const uc = givenTheSimplestUseCaseWithAuthorization()
                //then
                assert.deepEqual(uc.description, 'A use case')
            })

            it('should run', async () => {
                //given
                const uc = givenTheSimplestUseCaseWithAuthorization()
                //when
                uc.authorize({ user: "John", id: '923b8b9a', isAdmin: true })
                const ret = await uc.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const uc = givenTheSimplestUseCaseWithAuthorization()
                //when
                uc.authorize({ user: "John", id: '923b8b9a', isAdmin: true })
                await uc.run()
                //then
                assert.deepEqual(uc.auditTrail, {
                    type: 'use case',
                    description: 'A use case',
                    transactionId: uc._mainStep._auditTrail.transactionId,
                    return: Ok({}),
                    authorized: true,
                    user: {
                        user: 'John',
                        id: '923b8b9a',
                        isAdmin: true
                    },
                    steps: [{ type: 'step', description: 'Step 1', return: Ok() }]
                })
            })
        })

        context('with without access', () => {

            it('should initiate', () => {
                //given
                const uc = givenTheSimplestUseCaseWithAuthorization()
                //then
                assert.deepEqual(uc.description, 'A use case')
            })

            it('should not run', async () => {
                //given
                const uc = givenTheSimplestUseCaseWithAuthorization()
                //when
                uc.authorize({ user: "Bob", id: '923b8b9a', isAdmin: false })
                const ret = await uc.run()
                //then
                assert.ok(ret.isErr)
            })

            it('should not run if [authotize] is defined but not called', async () => {
                //given
                const uc = givenTheSimplestUseCaseWithAuthorization()
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isErr)
            })

            it('should audit', async () => {
                //given
                const uc = givenTheSimplestUseCaseWithAuthorization()
                //when
                uc.authorize({ user: "Bob", id: '923b8b9a', isAdmin: false })
                await uc.run()
                //then
                assert.deepEqual(uc.auditTrail, {
                    type: 'use case',
                    description: 'A use case',
                    transactionId: uc._mainStep._auditTrail.transactionId,
                    authorized: false,
                    user: {
                        user: 'Bob',
                        id: '923b8b9a',
                        isAdmin: false
                    }
                })
            })
        })
    })
})
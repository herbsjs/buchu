const { usecase } = require('../../src/usecase')
const { step } = require('../../src/step')
const { Ok, Err } = require('../../src/results')
const assert = require('assert')

describe('A use case', () => {

    describe('with multiple steps', () => {

        context('returning Ok', () => {

            const givenAMultiStepUseCase = () => {
                const uc = usecase('A use case', {
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Ok() }),
                    'step 3': step(() => { return Ok() })
                })
                return uc
            }

            it('should run', async () => {
                //given
                const uc = givenAMultiStepUseCase()
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const uc = givenAMultiStepUseCase()
                //when
                await uc.run()
                //then
                assert.deepStrictEqual(uc.auditTrail, {
                    type: 'use case',
                    description: 'A use case',
                    transactionId: uc._mainStep._auditTrail.transactionId,
                    elapsedTime: uc._mainStep._auditTrail.elapsedTime,
                    request: null,
                    return: { Ok: {} },
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[1].elapsedTime },
                        { type: 'step', description: 'step 3', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[2].elapsedTime },
                    ]
                })
            })
        })

        context('returning Err', async () => {

            const givenAMultiStepUseCaseWithError = () => {
                const uc = usecase('A use case', {
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Err() }),
                    'step 3': step(() => { return Ok() })
                })
                return uc
            }

            it('should run', async () => {
                //given
                const uc = givenAMultiStepUseCaseWithError()
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isErr)
            })

            it('should audit', async () => {
                //given
                const uc = givenAMultiStepUseCaseWithError()
                //when
                await uc.run()
                //then
                assert.deepStrictEqual(uc.auditTrail, {
                    type: 'use case',
                    description: 'A use case',
                    transactionId: uc._mainStep._auditTrail.transactionId,
                    elapsedTime: uc._mainStep._auditTrail.elapsedTime,
                    request: null,
                    return: { Error: '' },
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', return: { Error: '' }, elapsedTime: uc._auditTrail.steps[1].elapsedTime }
                    ]
                })
            })
        })

        context('using stop function', () => {

            const givenAMultiStepUseCase = () => {
                const uc = usecase('A use case', {
                    'step 1': step(() => {
                         return Ok() 
                        }),
                    'step 2': step((ctx) => { 
                        ctx.ret.sucess = true
                        ctx.stop()
                        return Ok() 
                    }),
                    'step 3': step(() => { 
                        ctx.ret.sucess = false
                        return Ok() 
                    })
                })
                return uc
            }
            const givenAMultiStepUseCaseWithError = () => {
                const uc = usecase('A use case', {
                    'step 1': step(() => {
                        return Ok() 
                       }),
                   'step 2': step((ctx) => { 
                       ctx.stop()
                       return Err('sucess') 
                   }),
                   'step 3': step(() => { 
                       return Ok() 
                   })
                })
                return uc
            }
            it('should run with Ok result', async () => {
                //given
                const uc = givenAMultiStepUseCase()
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isOk)
                assert(ret.ok.sucess)
            })

            it('should run with Err result', async () => {
                //given
                const uc = givenAMultiStepUseCaseWithError()
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isErr)
                assert(ret.err === 'sucess')
            })

            it('should run nested UseCase with Ok result', async () => {
                //given
                const uc = usecase('A use case', {
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(async () => { 
                        const nested = givenAMultiStepUseCase()
                        const result = await nested.run()
                        if(result.ok.sucess)
                            return Ok()
                        return Err()
                    }),
                    'step 3': step((ctx) => { 
                        ctx.ret.sucess = true
                        return Ok() 
                    })
                })
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isOk)
                assert(ret.ok.sucess)
            })

            it('should run nested UseCase with Err result', async () => {
                //given
                const uc = usecase('A use case', {
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(async () => { 
                        const nested = givenAMultiStepUseCaseWithError()
                        const result = await nested.run()
                        if(result.isErr)
                            return Ok()
                        return Err()
                    }),
                    'step 3': step((ctx) => { 
                        ctx.ret.sucess = true
                        return Ok() 
                    })
                })
                //when
                const ret = await uc.run()
                //then
                assert.ok(ret.isOk)
                assert(ret.ok.sucess)
            })

            it('should audit with Ok result', async () => {
                //given
                const uc = givenAMultiStepUseCase()
                //when
                await uc.run()
                //then
                assert.deepStrictEqual(uc.auditTrail, {
                    type: 'use case',
                    description: 'A use case',
                    transactionId: uc._mainStep._auditTrail.transactionId,
                    elapsedTime: uc._mainStep._auditTrail.elapsedTime,
                    request: null,
                    return: { Ok: { sucess: true }},
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', stopped: true, return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[1].elapsedTime },
                    ]
                })
            })

            it('should audit with Err result', async () => {
                //given
                const uc = givenAMultiStepUseCaseWithError()
                //when
                await uc.run()
                //then
                assert.deepStrictEqual(uc.auditTrail, {
                    type: 'use case',
                    description: 'A use case',
                    transactionId: uc._mainStep._auditTrail.transactionId,
                    elapsedTime: uc._mainStep._auditTrail.elapsedTime,
                    request: null,
                    return: { Error: 'sucess' },
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', stopped: true, return: { Error: 'sucess' }, elapsedTime: uc._auditTrail.steps[1].elapsedTime }
                    ]
                })
            })
        })
    })

})
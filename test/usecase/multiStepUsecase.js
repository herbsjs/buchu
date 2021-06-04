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
                    return: { Error: '' },
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', return: { Error: '' }, elapsedTime: uc._auditTrail.steps[1].elapsedTime }
                    ]
                })
            })
        })
    })

})
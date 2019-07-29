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

            it('should run', () => {
                //given
                const uc = givenTheSimplestUseCase()
                //when
                const ret = uc.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', () => {
                //given
                const uc = givenTheSimplestUseCase()
                //when
                uc.run()
                //then
                assert.deepEqual(uc.auditTrail, {
                    type: 'use case',
                    description: 'A use case',
                    return: Ok(),
                    steps: [
                        { type: 'step', description: 'A step', return: Ok() },
                        {
                            type: 'step', description: 'A second step', return: Ok(), steps: [
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
                    description: "A use case",
                    steps: [
                        { description: "A step", steps: null },
                        {
                            description: 'A second step',
                            steps: [
                                { description: 'step 1', steps: null },
                                { description: 'step 2', steps: null }
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

            it('should run', () => {
                //given
                const uc = givenTheSimplestUseCaseWithError()
                //when
                const ret = uc.run()
                //then
                assert.ok(ret.isErr)
            })
        })
    })
})
const { usecase } = require('../../src/usecase')
const { step } = require('../../src/step')
const { Ok, Err } = require('../../src/results')
const assert = require('assert')

describe('A use case', () => {

    describe('with multiple steps', () => {

        describe('returning Ok', () => {

            const givenAMultiStepUseCase = () => {
                const uc = usecase('A use case', {
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Ok() }),
                    'step 3': step(() => { return Ok() })
                })
                return uc
            }

            it('should run', () => {
                //given
                const uc = givenAMultiStepUseCase()
                //when
                const ret = uc.run()
                //then
                assert.ok(ret.isOk)
            })
        })

        describe('returning Err', () => {

            const givenAMultiStepUseCaseWithError = () => {
                const uc = usecase('A use case', {
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Err() }),
                    'step 3': step(() => { return Ok() })
                })
                return uc
            }

            it('should run', () => {
                //given
                const uc = givenAMultiStepUseCaseWithError()
                //when
                const ret = uc.run()
                //then
                assert.ok(ret.isErr)
            })
        })
    })

})
const { step } = require('../../src/step')
const { Ok, Err } = require('../../src/results')
const assert = require('assert')

describe('A step', () => {

    describe('with single nested steps', () => {

        context('returning Ok', () => {

            const givenNestedSteps = () => {
                const st = step({
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Ok() }),
                    'step 3': step(() => { return Ok() })
                })
                return st
            }

            it('should run', () => {
                //given
                const st = givenNestedSteps()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', () => {
                //given
                const st = givenNestedSteps()
                //when
                const ret = st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    steps: [
                        { type: 'step', description: 'step 1', return: Ok() },
                        { type: 'step', description: 'step 2', return: Ok() },
                        { type: 'step', description: 'step 3', return: Ok() }
                    ],
                    return: Ok()
                })
            })

            it('should doc', () => {
                //given
                const st = givenNestedSteps()
                //when
                const ret = st.doc()
                //then
                assert.deepEqual(ret, {
                    description: undefined,
                    steps: [
                        { description: 'step 1', steps: null },
                        { description: 'step 2', steps: null },
                        { description: 'step 3', steps: null }
                    ]
                })
            })
        })

        context('returning Err', () => {

            const givenNestedStepsWithError = () => {
                const st = step({
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Ok() }),
                    'step 3': step(() => { return Err() })
                })
                return st
            }

            it('should run', () => {
                //given
                const st = givenNestedStepsWithError()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isErr)
            })

            it('should audit', () => {
                //given
                const st = givenNestedStepsWithError()
                //when
                const ret = st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    steps: [
                        { type: 'step', description: 'step 1', return: Ok() },
                        { type: 'step', description: 'step 2', return: Ok() },
                        { type: 'step', description: 'step 3', return: Err() }
                    ],
                    return: Err()
                })
            })

        })
    })

    describe('with many nested steps', () => {

        context('returning Ok', () => {

            const givenManyNestedSteps = () => {
                const st = step({
                    'step 1': step({
                        'step 1.1': step(() => { return Ok() }),
                    }),
                    'step 2': step({
                        'step 2.1': step(() => { return Ok() }),
                        'step 2.2': step(() => { return Ok() })
                    }),
                    'step 3': step({
                        'step 3.1': step(() => { return Ok() }),
                        'step 3.2': step(() => { return Ok() }),
                        'step 3.3': step({
                            'step 3.3.1': step(() => { return Ok() }),
                            'step 3.3.2': step(() => { return Ok() }),
                            'step 3.3.3': step(() => { return Ok() })
                        })
                    })
                })
                return st
            }

            it('should run', () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = st.run()
                //then
                assert.deepEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    return: Ok(),
                    steps: [
                        {
                            type: 'step', description: 'step 1', return: Ok(), steps: [
                                { type: 'step', description: 'step 1.1', return: Ok() }
                            ]
                        },
                        {
                            type: 'step', description: 'step 2', return: Ok(), steps: [
                                { type: 'step', description: 'step 2.1', return: Ok() },
                                { type: 'step', description: 'step 2.2', return: Ok() }
                            ]
                        },
                        {
                            type: 'step', description: 'step 3', return: Ok(), steps: [
                                { type: 'step', description: 'step 3.1', return: Ok() },
                                { type: 'step', description: 'step 3.2', return: Ok() },
                                {
                                    type: 'step', description: 'step 3.3', return: Ok(), steps: [
                                        { type: 'step', description: 'step 3.3.1', return: Ok() },
                                        { type: 'step', description: 'step 3.3.2', return: Ok() },
                                        { type: 'step', description: 'step 3.3.3', return: Ok() }
                                    ]
                                }
                            ]
                        }]
                }
                )
            })

            it('should doc', () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = st.doc()
                //then
                assert.deepEqual(ret, {
                    description: undefined,
                    steps: [
                        {
                            description: 'step 1',
                            steps: [
                                { description: 'step 1.1', steps: null }
                            ]
                        },
                        {
                            description: 'step 2',
                            steps: [
                                { description: 'step 2.1', steps: null },
                                { description: 'step 2.2', steps: null }
                            ]
                        },
                        {
                            description: 'step 3',
                            steps: [
                                { description: 'step 3.1', steps: null },
                                { description: 'step 3.2', steps: null },
                                {
                                    description: 'step 3.3',
                                    steps: [
                                        { description: 'step 3.3.1', steps: null },
                                        { description: 'step 3.3.2', steps: null },
                                        { description: 'step 3.3.3', steps: null }
                                    ]
                                }
                            ]
                        }
                    ]
                })
            })
        })

        context('returning Err', () => {

            const givenManyNestedStepsWithError = () => {
                const st = step({
                    'step 1': step({
                        'step 1.1': step(() => { return Ok() }),
                        'step 1.2': step(() => { return Ok() })
                    }),
                    'step 2': step({
                        'step 2.1': step(() => { return Ok() }),
                        'step 2.2': step(() => { return Ok() })
                    }),
                    'step 3': step({
                        'step 3.1': step(() => { return Ok() }),
                        'step 3.2': step(() => { return Ok() }),
                        'step 3.3': step({
                            'step 3.3.1': step(() => { return Ok() }),
                            'step 3.3.2': step(() => { return Ok() }),
                            'step 3.3.3': step(() => { return Err() })
                        })
                    })
                })
                return st
            }

            it('should run', () => {
                //given
                const st = givenManyNestedStepsWithError()
                //when
                const ret = st.run()
                //then
                assert.ok(ret.isErr)
            })
        })
    })
})
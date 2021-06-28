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

            it('should run', async () => {
                //given
                const st = givenNestedSteps()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const st = givenNestedSteps()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].elapsedTime },
                        { type: 'step', description: 'step 3', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].elapsedTime }
                    ],
                    return: { Ok: {} }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

            it('should doc', () => {
                //given
                const st = givenNestedSteps()
                //when
                const ret = st.doc()
                //then
                assert.deepStrictEqual(ret, {
                    type: "step",
                    description: undefined,
                    steps: [
                        { type: "step", description: 'step 1', steps: null },
                        { type: "step", description: 'step 2', steps: null },
                        { type: "step", description: 'step 3', steps: null }
                    ]
                })
            })
        })

        context('returning a value', () => {

            const givenNestedStepsWithNoReturn = () => {
                const st = step({
                    'step 1': step(() => { return Ok(1) }),
                    'step 2': step(() => { return 2 }),
                    'step 3': step(() => { return [3] })
                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenNestedStepsWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const st = givenNestedStepsWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: 1 }, elapsedTime: st._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', return: 2, elapsedTime: st._auditTrail.steps[1].elapsedTime },
                        { type: 'step', description: 'step 3', return: [3], elapsedTime: st._auditTrail.steps[2].elapsedTime }
                    ],
                    return: { Ok: {} }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
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

            it('should run', async () => {
                //given
                const st = givenNestedStepsWithError()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
            })

            it('should audit', async () => {
                //given
                const st = givenNestedStepsWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].elapsedTime },
                        { type: 'step', description: 'step 3', return: { Error: '' }, elapsedTime: st._auditTrail.steps[2].elapsedTime }
                    ],
                    return: { Error: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

        })

        context('returning nothing', () => {

            const givenNestedStepsWithNoReturn = () => {
                const st = step({
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Ok() }),
                    'step 3': step(() => { })
                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenNestedStepsWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const st = givenNestedStepsWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].elapsedTime },
                        { type: 'step', description: 'step 3', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].elapsedTime }
                    ],
                    return: { Ok: {} }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
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

            it('should run', async () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Ok: {} },
                    steps: [
                        {
                            type: 'step', description: 'step 1', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[0].elapsedTime, steps: [
                                { type: 'step', description: 'step 1.1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[0].steps[0].elapsedTime }
                            ]
                        },
                        {
                            type: 'step', description: 'step 2', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[1].elapsedTime, steps: [
                                { type: 'step', description: 'step 2.1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].steps[0].elapsedTime },
                                { type: 'step', description: 'step 2.2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].steps[1].elapsedTime }
                            ]
                        },
                        {
                            type: 'step', description: 'step 3', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[2].elapsedTime, steps: [
                                { type: 'step', description: 'step 3.1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].steps[0].elapsedTime },
                                { type: 'step', description: 'step 3.2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].steps[1].elapsedTime },
                                {
                                    type: 'step', description: 'step 3.3', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[2].steps[2].elapsedTime, steps: [
                                        { type: 'step', description: 'step 3.3.1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].steps[2].steps[0].elapsedTime },
                                        { type: 'step', description: 'step 3.3.2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].steps[2].steps[1].elapsedTime },
                                        { type: 'step', description: 'step 3.3.3', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].steps[2].steps[2].elapsedTime }
                                    ]
                                }
                            ]
                        }]
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

            it('should doc', () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = st.doc()
                //then
                assert.deepStrictEqual(ret, {
                    type: "step",
                    description: undefined,
                    steps: [
                        {
                            type: "step",
                            description: 'step 1',
                            steps: [
                                { type: "step", description: 'step 1.1', steps: null }
                            ]
                        },
                        {
                            type: "step",
                            description: 'step 2',
                            steps: [
                                { type: "step", description: 'step 2.1', steps: null },
                                { type: "step", description: 'step 2.2', steps: null }
                            ]
                        },
                        {
                            type: "step",
                            description: 'step 3',
                            steps: [
                                { type: "step", description: 'step 3.1', steps: null },
                                { type: "step", description: 'step 3.2', steps: null },
                                {
                                    type: "step",
                                    description: 'step 3.3',
                                    steps: [
                                        { type: "step", description: 'step 3.3.1', steps: null },
                                        { type: "step", description: 'step 3.3.2', steps: null },
                                        { type: "step", description: 'step 3.3.3', steps: null }
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

            it('should run', async () => {
                //given
                const st = givenManyNestedStepsWithError()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
            })
        })
    })

    describe('with many nested steps with return value', () => {

        context('returning Ok', () => {

            const givenManyNestedStepsWithReturn = () => {
                const st = step({
                    'step 1': step({
                        'step 1.1': step(() => { return Ok(1) }),
                    }),
                    'step 2': step({
                        'step 2.1': step(() => { return Ok(2) }),
                        'step 2.2': step(() => { return Ok(3) })
                    }),
                    'step 3': step({
                        'step 3.1': step(() => { return Ok(4) }),
                        'step 3.2': step(() => { return Ok(5) }),
                        'step 3.3': step({
                            'step 3.3.1': step(() => { return Ok(6) }),
                            'step 3.3.2': step(() => { return Ok(7) }),
                            'step 3.3.3': step(() => { return Ok(8) })
                        })
                    })
                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenManyNestedStepsWithReturn()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert.deepStrictEqual(ret.value, {})
            })

            it('should audit', async () => {
                //given
                const st = givenManyNestedStepsWithReturn()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Ok: {} },
                    steps: [
                        {
                            type: 'step', description: 'step 1', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[0].elapsedTime, steps: [
                                { type: 'step', description: 'step 1.1', return: { Ok: 1 }, elapsedTime: st._auditTrail.steps[0].steps[0].elapsedTime }
                            ]
                        },
                        {
                            type: 'step', description: 'step 2', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[1].elapsedTime, steps: [
                                { type: 'step', description: 'step 2.1', return: { Ok: 2 }, elapsedTime: st._auditTrail.steps[1].steps[0].elapsedTime },
                                { type: 'step', description: 'step 2.2', return: { Ok: 3 }, elapsedTime: st._auditTrail.steps[1].steps[1].elapsedTime }
                            ]
                        },
                        {
                            type: 'step', description: 'step 3', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[2].elapsedTime, steps: [
                                { type: 'step', description: 'step 3.1', return: { Ok: 4 }, elapsedTime: st._auditTrail.steps[2].steps[0].elapsedTime },
                                { type: 'step', description: 'step 3.2', return: { Ok: 5 }, elapsedTime: st._auditTrail.steps[2].steps[1].elapsedTime },
                                {
                                    type: 'step', description: 'step 3.3', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[2].steps[2].elapsedTime, steps: [
                                        { type: 'step', description: 'step 3.3.1', return: { Ok: 6 }, elapsedTime: st._auditTrail.steps[2].steps[2].steps[0].elapsedTime },
                                        { type: 'step', description: 'step 3.3.2', return: { Ok: 7 }, elapsedTime: st._auditTrail.steps[2].steps[2].steps[1].elapsedTime },
                                        { type: 'step', description: 'step 3.3.3', return: { Ok: 8 }, elapsedTime: st._auditTrail.steps[2].steps[2].steps[2].elapsedTime }
                                    ]
                                }
                            ]
                        }]
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

        })

        context('returning Err', () => {

            const givenManyNestedStepsWithReturntWithError = () => {
                const st = step({
                    'step 1': step({
                        'step 1.1': step(() => { return Ok(1) }),
                        'step 1.2': step(() => { return Ok(2) })
                    }),
                    'step 2': step({
                        'step 2.1': step(() => { return Ok(3) }),
                        'step 2.2': step(() => { return Ok(4) })
                    }),
                    'step 3': step({
                        'step 3.1': step(() => { return Ok(5) }),
                        'step 3.2': step(() => { return Ok(6) }),
                        'step 3.3': step({
                            'step 3.3.1': step(() => { return Ok(7) }),
                            'step 3.3.2': step(() => { return Ok(8) }),
                            'step 3.3.3': step(() => { return Err(9) })
                        })
                    })
                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenManyNestedStepsWithReturntWithError()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
                assert.deepStrictEqual(ret.err, 9)
            })
        })
    })

    describe('with nested steps using stop function', () => {

        context('returning Ok to single nested steps', () => {

            const givenNestedSteps = () => {
                const st = step({
                    'step 1': step(() => { return Ok() }),
                    'step 2': step((ctx) => { 
                        ctx.ret = {stopped: true}
                        ctx.stop()                        
                        return Ok() 
                    }),
                    'step 3': step(() => { return Ok() })
                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenNestedSteps()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert(ret.ok.stopped === true)
            })

            it('should audit', async () => {
                //given
                const st = givenNestedSteps()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', stopped: true, return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].elapsedTime },
                    ],
                    return: { Ok: {stopped: true} }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

            it('should doc', () => {
                //given
                const st = givenNestedSteps()
                //when
                const ret = st.doc()
                //then
                assert.deepStrictEqual(ret, {
                    type: "step",
                    description: undefined,
                    steps: [
                        { type: "step", description: 'step 1', steps: null },
                        { type: "step", description: 'step 2', steps: null },
                        { type: "step", description: 'step 3', steps: null }
                    ]
                })
            })
        })

        
        context('returning Ok to many nested steps', () => {

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
                            'step 3.3.1': step((ctx) => {
                                ctx.ret = {stopped: true}
                                ctx.stop()
                                return Ok() 
                            }),
                            'step 3.3.2': step(() => { return Ok() }),
                            'step 3.3.3': step(() => { return Ok() })
                        })
                    })
                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
                assert(ret.ok.stopped === true)
            })

            it('should audit', async () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    return: { Ok: {'stopped': true} },
                    steps: [
                        {
                            type: 'step', description: 'step 1', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[0].elapsedTime, steps: [
                                { type: 'step', description: 'step 1.1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[0].steps[0].elapsedTime }
                            ]
                        },
                        {
                            type: 'step', description: 'step 2', return: { Ok: {} }, elapsedTime: st._auditTrail.steps[1].elapsedTime, steps: [
                                { type: 'step', description: 'step 2.1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].steps[0].elapsedTime },
                                { type: 'step', description: 'step 2.2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].steps[1].elapsedTime }
                            ]
                        },
                        {
                            type: 'step', description: 'step 3', stopped: true, return: { Ok: {'stopped': true} }, elapsedTime: st._auditTrail.steps[2].elapsedTime, steps: [
                                { type: 'step', description: 'step 3.1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].steps[0].elapsedTime },
                                { type: 'step', description: 'step 3.2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].steps[1].elapsedTime },
                                {
                                    type: 'step', description: 'step 3.3', stopped: true, return: { Ok: {'stopped': true} }, elapsedTime: st._auditTrail.steps[2].steps[2].elapsedTime, steps: [
                                        { type: 'step', description: 'step 3.3.1', stopped: true, return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].steps[2].steps[0].elapsedTime }
                                    ]
                                }
                            ]
                        }]
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

            it('should doc', () => {
                //given
                const st = givenManyNestedSteps()
                //when
                const ret = st.doc()
                //then
                assert.deepStrictEqual(ret, {
                    type: "step",
                    description: undefined,
                    steps: [
                        {
                            type: "step",
                            description: 'step 1',
                            steps: [
                                { type: "step", description: 'step 1.1', steps: null }
                            ]
                        },
                        {
                            type: "step",
                            description: 'step 2',
                            steps: [
                                { type: "step", description: 'step 2.1', steps: null },
                                { type: "step", description: 'step 2.2', steps: null }
                            ]
                        },
                        {
                            type: "step",
                            description: 'step 3',
                            steps: [
                                { type: "step", description: 'step 3.1', steps: null },
                                { type: "step", description: 'step 3.2', steps: null },
                                {
                                    type: "step",
                                    description: 'step 3.3',
                                    steps: [
                                        { type: "step", description: 'step 3.3.1', steps: null },
                                        { type: "step", description: 'step 3.3.2', steps: null },
                                        { type: "step", description: 'step 3.3.3', steps: null }
                                    ]
                                }
                            ]
                        }
                    ]
                })
            })

        })

        context('returning a value', () => {

            const givenNestedStepsWithNoReturn = () => {
                const st = step({
                    'step 1': step(() => { return Ok(1) }),
                    'step 2': step((ctx) => { 
                        ctx.stop()
                        return 2 
                    }),
                    'step 3': step(() => { return [3] })
                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenNestedStepsWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const st = givenNestedStepsWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: 1 }, elapsedTime: st._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', stopped: true, return: 2, elapsedTime: st._auditTrail.steps[1].elapsedTime },
                    ],
                    return: { Ok: {} }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

        })

        context('returning Err', () => {

            const givenNestedStepsWithError = () => {
                const st = step({
                    'step 1': step(() => { return Ok() }),
                    'step 2': step((ctx) => {  
                        ctx.stop()
                        return Err() 
                     }),
                    'step 3': step(() => { return Ok() })
                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenNestedStepsWithError()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
            })

            it('should audit', async () => {
                //given
                const st = givenNestedStepsWithError()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', stopped: true, return: { Error: '' }, elapsedTime: st._auditTrail.steps[1].elapsedTime },
                    ],
                    return: { Error: '' }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

        })

        context('returning nothing', () => {

            const givenNestedStepsWithNoReturn = () => {
                const st = step({
                    'step 1': step(() => { return Ok() }),
                    'step 2': step(() => { return Ok() }),
                    'step 3': step((ctx) => { ctx.stop() }),
                    'step 4': step(() => { })

                })
                return st
            }

            it('should run', async () => {
                //given
                const st = givenNestedStepsWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should audit', async () => {
                //given
                const st = givenNestedStepsWithNoReturn()
                //when
                const ret = await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'step',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    steps: [
                        { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[0].elapsedTime },
                        { type: 'step', description: 'step 2', return: { Ok: '' }, elapsedTime: st._auditTrail.steps[1].elapsedTime },
                        { type: 'step', description: 'step 3', stopped: true, return: { Ok: '' }, elapsedTime: st._auditTrail.steps[2].elapsedTime }
                    ],
                    return: { Ok: {} }
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

        })
    })
})
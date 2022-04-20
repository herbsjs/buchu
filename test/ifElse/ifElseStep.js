const {entity, field} = require('@herbsjs/gotu')
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
            assert.deepStrictEqual(uc.auditTrail, {
                type: 'use case',
                description: 'A use case',
                transactionId: uc._mainStep._auditTrail.transactionId,
                elapsedTime: uc._mainStep._auditTrail.elapsedTime,
                request: null,
                return: { Ok: {} },
                steps: [
                    {
                        type: 'if else',
                        description: 'A condition',
                        returnIf: {
                            description: 'If Step',
                            elapsedTime: uc._auditTrail.steps[0].returnIf.elapsedTime,
                            type: 'step',
                            return: { Ok: true }
                        },
                        returnThen: {
                            description: "Then Step",
                            elapsedTime: uc._auditTrail.steps[0].returnThen.elapsedTime,
                            return: { Ok: '' },
                            type: "step"
                        },
                        elapsedTime: uc._auditTrail.steps[0].elapsedTime,
                    },
                ],
            })
        })

        it('should doc', async () => {
            //given
            const uc = givenASimpleUseCase()
            //when
            const ret = uc.doc()
            //then
            assert.deepStrictEqual(ret,
                {
                    type: 'use case',
                    description: 'A use case',
                    steps: [{
                        description: 'A condition',
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
                        }
                    }]
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
            assert.deepStrictEqual(ret.value, { IfStep: 10, ThenStep: 20 })
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
            assert.strictEqual(ret.value.return1, 1)
        })

        it('should run - else', async () => {
            //given
            const uc = givenASimpleUseCaseWithRequest()
            //when
            const ret = await uc.run({ param1: 2 })
            //then
            assert.ok(ret.isOk)
            assert.strictEqual(ret.value.return2, 2)
        })

        it('should audit', async () => {
            //given
            const uc = givenASimpleUseCaseWithRequest()
            //when
            await uc.run({ param1: 1 })
            //then
            assert.deepStrictEqual(uc.auditTrail, {
                type: 'use case',
                description: 'A use case',
                transactionId: uc._mainStep._auditTrail.transactionId,
                elapsedTime: uc._mainStep._auditTrail.elapsedTime,
                request: { param1: 1 },
                return: { Ok: { return1: 1 } },
                steps: [
                    {
                        type: 'if else',
                        description: 'A condition',
                        returnIf: {
                            description: 'If Step',
                            elapsedTime: uc._auditTrail.steps[0].returnIf.elapsedTime,
                            type: 'step',
                            return: { Ok: true }
                        },
                        returnThen: {
                            description: "Then Step",
                            elapsedTime: uc._auditTrail.steps[0].returnThen.elapsedTime,
                            return: { Ok: '' },
                            type: "step"
                        },
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
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    returnIf: {
                        description: 'If Step',
                        elapsedTime: st.auditTrail.returnIf.elapsedTime,
                        type: 'step',
                        return: { Ok: true }
                    },
                    returnThen: {
                        description: "Then Step",
                        elapsedTime: st.auditTrail.returnThen.elapsedTime,
                        return: { Ok: '' },
                        type: "step"
                    },
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })

            it('should doc', () => {
                //given
                const st = givenAnIfThenStep()
                //when
                const ret = st.doc()
                //then
                assert.deepStrictEqual(ret, {
                    description: undefined,
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
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    elapsedTime: st.auditTrail.elapsedTime,
                    returnIf: {
                        description: 'If',
                        elapsedTime: st.auditTrail.returnIf.elapsedTime,
                        type: 'step',
                        return: { Ok: false }
                    },
                    returnElse: {
                        description: "Else",
                        elapsedTime: st.auditTrail.returnElse.elapsedTime,
                        return: { Ok: '' },
                        type: "step"
                    },
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })
    })

    describe('If Else Then with return value', () => {
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
                assert.deepStrictEqual(ret.value, 2)
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
                assert.deepStrictEqual(ret.value, 3)
            })
        })
    })

    describe('on a use case with context use stop function', () => {
        const givenASimpleUseCaseWithContext = () => {
            const uc = usecase('A use case', {
                'A condition': ifElse({
                    'If Step': step((ctx) => { ctx.ret.stopStatus = false; return Ok(true) }),
                    'Then Step': step((ctx) => {
                        ctx.ret.stopStatus = true
                        ctx.stop()
                        return Ok()
                    }),
                    'Else Step': step((ctx) => { ctx.ret.stopStatus = false; return Err() })
                }),
                'Step after condition': step((ctx) => { ctx.ret.stopStatus = false; return Ok() })
            })
            return uc
        }

        it('should run and stop', async () => {
            //given
            const uc = givenASimpleUseCaseWithContext()
            //when
            const ret = await uc.run()
            //then
            assert.ok(ret.isOk)
            assert(ret.value.stopStatus)
        })
    })

    describe('on a use case use stop function inside condition step', () => {
        const givenASimpleUseCaseWithContext = () => {
            const uc = usecase('A use case', {
                'A condition': ifElse({
                    'If Step with stop function': step((ctx) => {
                        ctx.stop()
                        ctx.ret.IfStep = 10
                        return Ok(true)
                    }),
                    'Then Step': step((ctx) => { ctx.ret.ThenStep = 20; return Ok() }),
                    'Else Step': step((ctx) => { ctx.ret.ElseStep = 30; return Err() })
                }),
            })
            return uc
        }

        it('should run without stop', async () => {
            //given
            const uc = givenASimpleUseCaseWithContext()
            //when
            const ret = await uc.run()
            //then
            assert.ok(ret.isOk)
            assert.deepStrictEqual(ret.value, { IfStep: 10, ThenStep: 20 })
        })
    })

    describe('using nested steps', () => {
        context('returning Ok from Then', () => {
            const givenAnIfThenStepUc = () => {
                const ifElseStep = ifElse({
                    'If Step': step((ctx) => { return Ok(true) }),
                    'Then Step': step({
                        'nested step 1': step(() => { return Ok('response nestedstep 1') }),
                        'nested step 2': step(() => { return Ok('response nestedstep 2') })
                    }),
                    'Else Step': step({
                        'nested step 1': step(() => { return Err('response nestedstep 1') }),
                        'nested step 2': step(() => { return Ok('response nestedstep 2') })
                    })
                })

                return ifElseStep
            }

            it('should run', async () => {
                //given
                const st = givenAnIfThenStepUc()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isOk)
            })

            it('should doc', () => {
                //given
                const st = givenAnIfThenStepUc()
                //when
                const ret = st.doc()
                //then
                assert.deepStrictEqual(ret, {
                    description: undefined,
                    type: "if else",
                    else: {
                        description: "Else Step",
                        steps: [
                            {
                                description: "nested step 1",
                                steps: null,
                                type: "step"
                            },
                            {
                                description: "nested step 2",
                                steps: null,
                                type: "step"
                            }
                        ],
                        type: "step"
                    },
                    if: {
                        description: "If Step",
                        steps: null,
                        type: "step"
                    },
                    then: {
                        description: "Then Step",
                        steps: [
                            {
                                description: "nested step 1",
                                steps: null,
                                type: "step"
                            },
                            {
                                description: "nested step 2",
                                steps: null,
                                type: "step"
                            }
                        ],
                        type: "step"
                    }
                })
            })

            it('should audit', async () => {
                //given
                const st = givenAnIfThenStepUc()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    returnIf: {
                        description: "If Step",
                        type: "step",
                        elapsedTime: st.auditTrail.returnIf.elapsedTime,
                        return: { Ok: true },
                    },
                    returnThen: {
                        description: "Then Step",
                        type: "step",
                        elapsedTime: st.auditTrail.returnThen.elapsedTime,
                        return: {
                            Ok: {}
                        },
                        steps: [
                            {
                                description: "nested step 1",
                                type: "step",
                                elapsedTime: st.auditTrail.returnThen.steps[0].elapsedTime,
                                return: {
                                    Ok: "response nestedstep 1"
                                }
                            },
                            {
                                description: "nested step 2",
                                type: "step",
                                elapsedTime: st.auditTrail.returnThen.steps[1].elapsedTime,
                                return: {
                                    Ok: "response nestedstep 2"
                                }
                            }
                        ]
                    },
                    elapsedTime: st.auditTrail.elapsedTime
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })

        context('returning Err from Then', () => {
            const givenAnIfThenStepUc = () => {
                const ifElseStep = ifElse({
                    'If Step': step((ctx) => { return Ok(true) }),
                    'Then Step': step({
                        'nested step 1': step(() => { return Ok('response nestedstep 1') }),
                        'nested step 2': step(() => { return Err('nested step error') })
                    }),
                    'Else Step': step({
                        'nested step 1': step(() => { return Ok('response nestedstep 1') }),
                        'nested step 2': step(() => { return Ok('response nestedstep 2') })
                    })
                })

                return ifElseStep
            }

            it('should run', async () => {
                //given
                const st = givenAnIfThenStepUc()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
            })

            it('should doc', () => {
                //given
                const st = givenAnIfThenStepUc()
                //when
                const ret = st.doc()
                //then
                assert.deepStrictEqual(ret, {
                    description: undefined,
                    type: "if else",
                    else: {
                        description: "Else Step",
                        steps: [
                            {
                                description: "nested step 1",
                                steps: null,
                                type: "step"
                            },
                            {
                                description: "nested step 2",
                                steps: null,
                                type: "step"
                            }
                        ],
                        type: "step"
                    },
                    if: {
                        description: "If Step",
                        steps: null,
                        type: "step"
                    },
                    then: {
                        description: "Then Step",
                        steps: [
                            {
                                description: "nested step 1",
                                steps: null,
                                type: "step"
                            },
                            {
                                description: "nested step 2",
                                steps: null,
                                type: "step"
                            }
                        ],
                        type: "step"
                    }
                })
            })

            it('should audit', async () => {
                //given
                const st = givenAnIfThenStepUc()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    returnIf: {
                        description: "If Step",
                        type: "step",
                        elapsedTime: st.auditTrail.returnIf.elapsedTime,
                        return: { Ok: true },
                    },
                    returnThen: {
                        description: "Then Step",
                        type: "step",
                        elapsedTime: st.auditTrail.returnThen.elapsedTime,
                        return: {
                            Error: "nested step error"
                        },
                        steps: [
                            {
                                description: "nested step 1",
                                type: "step",
                                elapsedTime: st.auditTrail.returnThen.steps[0].elapsedTime,
                                return: {
                                    Ok: "response nestedstep 1"
                                }
                            },
                            {
                                description: "nested step 2",
                                type: "step",
                                elapsedTime: st.auditTrail.returnThen.steps[1].elapsedTime,
                                return: {
                                    Error: "nested step error"
                                }
                            }
                        ]
                    },
                    elapsedTime: st.auditTrail.elapsedTime
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })

        context('returning Ok from Else', () => {
            const givenAnIfElseStep = () => {
                const ifElseStep = ifElse({
                    'If Step': step((ctx) => { return Ok(false) }),
                    'Then Step': step({
                        'nested step 1': step(() => { return Ok('response nestedstep 1') }),
                        'nested step 2': step(() => { return Ok('response nestedstep 2') })
                    }),
                    'Else Step': step({
                        'nested step 1': step(() => { return Ok('response nestedstep 1') }),
                        'nested step 2': step(() => { return Ok('response nestedstep 2') })
                    })
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
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    returnIf: {
                        description: "If Step",
                        type: "step",
                        elapsedTime: st.auditTrail.returnIf.elapsedTime,
                        return: { Ok: false },
                    },
                    returnElse: {
                        description: "Else Step",
                        type: "step",
                        elapsedTime: st.auditTrail.returnElse.elapsedTime,
                        return: {
                            Ok: {}
                        },
                        steps: [
                            {
                                description: "nested step 1",
                                type: "step",
                                elapsedTime: st.auditTrail.returnElse.steps[0].elapsedTime,
                                return: {
                                    Ok: "response nestedstep 1"
                                }
                            },
                            {
                                description: "nested step 2",
                                type: "step",
                                elapsedTime: st.auditTrail.returnElse.steps[1].elapsedTime,
                                return: {
                                    Ok: "response nestedstep 2"
                                }
                            }
                        ]
                    },
                    elapsedTime: st.auditTrail.elapsedTime
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })

        context('returning Err from Else', () => {
            const givenAnIfElseStep = () => {
                const ifElseStep = ifElse({
                    'If Step': step((ctx) => { return Ok(false) }),
                    'Then Step': step({
                        'nested step 1': step(() => { return Ok('response nestedstep 1') }),
                        'nested step 2': step(() => { return Ok('response nestedstep 2') })
                    }),
                    'Else Step': step({
                        'nested step 1': step(() => { return Err('response nestedstep 1') }),
                        'nested step 2': step(() => { return Ok('response nestedstep 2') })
                    })
                })
                return ifElseStep
            }

            it('should run', async () => {
                //given
                const st = givenAnIfElseStep()
                //when
                const ret = await st.run()
                //then
                assert.ok(ret.isErr)
            })

            it('should audit', async () => {
                //given
                const st = givenAnIfElseStep()
                //when
                await st.run()
                //then
                assert.deepStrictEqual(st.auditTrail, {
                    type: 'if else',
                    description: undefined,
                    returnIf: {
                        description: "If Step",
                        type: "step",
                        elapsedTime: st.auditTrail.returnIf.elapsedTime,
                        return: { Ok: false },
                    },
                    returnElse: {
                        description: "Else Step",
                        type: "step",
                        elapsedTime: st.auditTrail.returnElse.elapsedTime,
                        return: {
                            Error: "response nestedstep 1"
                        },
                        steps: [
                            {
                                description: "nested step 1",
                                type: "step",
                                elapsedTime: st.auditTrail.returnElse.steps[0].elapsedTime,
                                return: {
                                    Error: "response nestedstep 1"
                                }
                            }
                        ]
                    },
                    elapsedTime: st.auditTrail.elapsedTime
                })
                assert.ok(st.auditTrail.elapsedTime > 0)
            })
        })
    })
})

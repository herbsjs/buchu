const { Ok, Err } = require('./results')

class IfElse {

    constructor(body) {
        this._body = body
    }

    run() {
        const steps = Object.entries(this._body)
        const [ifStep, thenStep, elseStep] = steps
        const ifRet = ifStep[1].run()
        if (ifRet.isOk) { return thenStep[1].run() }
        else { return elseStep[1].run() }
    }

    doc() {
        const addDescription = (info) => {
            const [description, step] = info
            step.description = description
            return step
        }

        const steps = Object.entries(this._body)
        const [ifStepInfo, thenStepInfo, elseStepInfo] = steps

        const ifStep = addDescription(ifStepInfo)
        const thenStep = addDescription(thenStepInfo)
        const elseStep = addDescription(elseStepInfo)

        return {
            'if': ifStep.doc(),
            'then': thenStep.doc(),
            'else': elseStep.doc()
        }
    }
}

const ifElse = (body) => {
    return new IfElse(body)
}

module.exports = { ifElse }
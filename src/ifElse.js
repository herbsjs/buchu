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
        const steps = Object.entries(this._body)
        const [ifStep, thenStep, elseStep] = steps
        return {
            'if': {
                description: ifStep[0],
                steps: ifStep[1].doc()
            },
            'then': {
                description: thenStep[0],
                steps: thenStep[1].doc()
            },
            'else': {
                description: elseStep[0],
                steps: elseStep[1].doc()
            }
        }
    }
}

const ifElse = (body) => {
    return new IfElse(body)
}

module.exports = { ifElse }
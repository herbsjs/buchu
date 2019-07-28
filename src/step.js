const { Ok, Err } = require('./results')

const stepTypes = Object.freeze({
    Func: 1,
    Nested: 2,
    check(body) {
        if (typeof body === "function") return stepTypes.Func
        return stepTypes.Nested
    }
})

class Step {

    constructor(body) {
        this._body = body
    }

    run() {

        const type = stepTypes.check(this._body)

        const _runFunction = () => {
            if (type != stepTypes.Func) return
            return this._body()
        }

        const _runNestedSteps = () => {
            if (type != stepTypes.Nested) return
            const steps = Object.entries(this._body)
            for (const step of steps) {
                const ret = step[1].run()
                if (ret.isErr) return ret
            }
            return Ok()
        }

        let ret = undefined;

        ret = _runFunction()
        if (ret) return ret;

        ret = _runNestedSteps()
        return ret;

    }

    doc() {
        const type = stepTypes.check(this._body)
        if (type == stepTypes.Func) return null
        if (type == stepTypes.Nested) {

            const stepsDoc = []
            const steps = Object.entries(this._body)
            for (const step of steps) {
                const ret = step[1].doc()
                if (ret)
                    stepsDoc.push({ description: step[0], steps: ret })
                else
                    stepsDoc.push({ description: step[0] })
            }
            return stepsDoc
        }

    }
}

const step = (body) => {
    return new Step(body)
}

module.exports = { step }
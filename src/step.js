const { Ok, Err } = require('./results')

class Step {

    constructor(body) {
        this._body = body
    }

    run() {

        const _runFunction = () => {
            if (!(typeof this._body === "function")) return
            return this._body()
        }

        const _runNestedSteps = () => {
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

}

const step = (body) => {
    return new Step(body)
}

module.exports = { step }
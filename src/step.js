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
        this.description = undefined
        this._body = body
        this._auditTrail = {
            type: "step"
        }
        this.context = {
            di: {},
            ret: {},
            req: {}
        }
    }

    async run(request) {

        const type = stepTypes.check(this._body)
        
        const _runFunction = async () => {
            if (type != stepTypes.Func) return
            const ret = await this._body(this.context)
            return ret
        }

        const _runNestedSteps = async () => {
            if (type != stepTypes.Nested) return
            const steps = Object.entries(this._body)
            this._auditTrail.steps = []
            for (const stepInfo of steps) {
                
                const [description, step] = stepInfo
                if (step === null) continue
                step.description = description
                step.context = this.context
                
                const ret = await step.run()
                
                this._auditTrail.steps.push(step.auditTrail)
                
                if (ret.isErr) return ret
            }
            return Ok({...this.context.ret})
        }

        let ret = undefined
        this._auditTrail.description = this.description

        ret = this._auditTrail.return = await _runFunction()
        if (ret) return ret;

        ret = this._auditTrail.return = await _runNestedSteps()
        return ret;
    }

    doc() {
        const docStep = { description: this.description, steps: null }
        const type = stepTypes.check(this._body)
        if (type == stepTypes.Nested) {

            const docArray = []
            const steps = Object.entries(this._body)
            for (const stepInfo of steps) {
                const [description, step] = stepInfo
                if (step === null) continue
                step.description = description
                docArray.push(step.doc())
            }
            docStep.steps = docArray
        }

        return docStep;

    }

    get auditTrail() {
        return this._auditTrail
    }
}

const step = (body) => {
    return new Step(body)
}

module.exports = { step }
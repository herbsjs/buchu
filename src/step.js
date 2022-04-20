const { Ok, Err } = require('./results')
const objectSerialization = require('./helpers/objectSerialization')

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
        this.type = "step"
        this.description = undefined
        this._body = body
        this._auditTrail = { type: this.type }
        this.context = {
            ret: {},
            req: {},
            _stopExecution: undefined,
            stop() {
                this._stopExecution = true
            }
        }
    }

    async run() {
        const startTime = process.hrtime.bigint() /* measure time */

        const type = stepTypes.check(this._body)

        const _runFunction = async () => {
            if (type != stepTypes.Func) return
            let ret

            if (process.env.HERBS_EXCEPTION === "audit") {
                try { ret = await this._body(this.context) }
                catch (error) { ret = Err(error) }
            }
            else
                ret = await this._body(this.context)
            ret = ret || Ok()
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

                let ret = await step.run()

                if (step.context._stopExecution) 
                    step.auditTrail.stopped = true
                
                this._auditTrail.steps.push(step.auditTrail)

                if (ret.isErr) return ret

                if(step.context._stopExecution) break
            }
            let ret = this.context.ret
            return Ok(ret)
        }

        let ret = undefined
        this._auditTrail.description = this.description
        this._auditTrail.return = ""
        
        ret = await _runFunction()
        if (ret !== undefined) this._auditTrail.return = objectSerialization(ret)

        if (ret) {
            this._auditTrail.elapsedTime = process.hrtime.bigint() - startTime
            return ret
        }

        ret = await _runNestedSteps()
        this._auditTrail.return = objectSerialization(ret)
        this._auditTrail.elapsedTime = process.hrtime.bigint() - startTime
        return ret
    }

    doc() {
        const docStep = { type: this.type, description: this.description, steps: null }
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
        return docStep
    }

    get auditTrail() {
        return this._auditTrail
    }
}

const step = (body) => {
    return new Step(body)
}

module.exports = { step }
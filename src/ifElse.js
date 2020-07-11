const { Ok, Err } = require('./results');

class IfElse {

    constructor(body) {
        this.type = "if else"
        this._body = body
        this._auditTrail = { type: this.type }
    }

    _addMeta = (info) => {
        const [description, step] = info
        step.description = description
        step.context = this.context
        return step
    }
    
    async run() {
        this._auditTrail.description = this.description

        const steps = Object.entries(this._body)
        const [ifInfo, thenInfo, elseInfo] = steps

        const ifStep = this._addMeta(ifInfo)
        const thenStep = this._addMeta(thenInfo)
        const elseStep = this._addMeta(elseInfo)

        const ifRet = this._auditTrail.returnIf = await ifStep.run()
        if (ifRet && ifRet.isOk && ifRet.value === true) { return this._auditTrail.returnThen = await thenStep.run() }
        if (ifRet && ifRet.isOk && ifRet.value === false) { return this._auditTrail.returnElse = await elseStep.run() }
        return this._auditTrail.returnIf = Err({ value: ifRet, msg: 'Invalid ifElse' })
    }

    doc() {
        const steps = Object.entries(this._body)
        const [ifInfo, thenInfo, elseInfo] = steps

        const ifStep = this._addMeta(ifInfo)
        const thenStep = this._addMeta(thenInfo)
        const elseStep = this._addMeta(elseInfo)

        return {
            type: this.type,
            'if': ifStep.doc(),
            'then': thenStep.doc(),
            'else': elseStep.doc()
        }
    }

    get auditTrail() {
        return this._auditTrail
    }
}

const ifElse = (body) => {
    return new IfElse(body)
}

module.exports = { ifElse }
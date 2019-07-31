const { Ok, Err } = require('./results')

class IfElse {

    constructor(body) {
        this._body = body
        this._auditTrail = {
            type: "if else"
        }
    }

    _addMeta = (info) => {
        const [description, step] = info
        step.description = description
        step.context = this.context
        return step
    }

    run() {
        this._auditTrail.description = this.description

        const steps = Object.entries(this._body)
        const [ifInfo, thenInfo, elseInfo] = steps

        const ifStep = this._addMeta(ifInfo)
        const thenStep = this._addMeta(thenInfo)
        const elseStep = this._addMeta(elseInfo)

        const ifRet = this._auditTrail.returnIf = ifStep.run()
        if (ifRet && ifRet.isOk) { return this._auditTrail.returnThen = thenStep.run() }
        if (ifRet && ifRet.isErr) { return this._auditTrail.returnElse = elseStep.run() }
        return this._auditTrail.returnIf = Err('Invalid ifElse')
    }

    doc() {
        const steps = Object.entries(this._body)
        const [ifInfo, thenInfo, elseInfo] = steps

        const ifStep = this._addMeta(ifInfo)
        const thenStep = this._addMeta(thenInfo)
        const elseStep = this._addMeta(elseInfo)

        return {
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
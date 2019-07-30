const { step } = require('./step')
const { Ok, Err } = require('./results')

class UseCase {

    constructor(description, body) {
        this.description = description
        this._mainStep = step(body)
        this._mainStep.description = description
        this._mainStep._auditTrail.type = "use case"
    }

    run() {
        return this._mainStep.run()
    }

    doc() {
        return this._mainStep.doc()
    }

    get auditTrail() {
        return this._mainStep.auditTrail
    }

}

const usecase = (description, body) => {
    return new UseCase(description, body)
}

module.exports = { usecase }
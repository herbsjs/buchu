const { step } = require('./step')
const { schema } = require('./schema')
const uuidv4 = require('uuid/v4');
const { Ok, Err } = require('./results')

class UseCase {

    constructor(description, body) {
        this.description = description

        //request schema
        this._requestSchema = body.request
        delete body.request

        // main step
        this._mainStep = step(body)
        this._mainStep.description = description
        this._mainStep._auditTrail.type = "use case"
        this._mainStep._auditTrail.transactionId = uuidv4()
    }

    run(request) {

        if (request) {
            const requestSchema = schema(this._requestSchema)
            requestSchema.validate(request)
            if (!requestSchema.isValid) return Err(requestSchema.errors)
            this._mainStep.context.req = request
        }

        return this._mainStep.run()
    }

    doc() {
        const docStep = this._mainStep.doc()
        if (this._requestSchema) docStep.request = this._requestSchema
        return docStep
    }

    get auditTrail() {
        return this._mainStep.auditTrail
    }

}

const usecase = (description, body) => {
    return new UseCase(description, body)
}

module.exports = { usecase }
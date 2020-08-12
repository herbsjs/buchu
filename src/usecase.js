const { step } = require('./step')
const { schema } = require('./schema')
const { v4: uuidv4 } = require('uuid')
const { Err } = require('./results')

class UseCase {

    constructor(description, body) {
        this.type = "use case"
        this.description = description

        //request schema
        this._requestSchema = body.request
        delete body.request

        //authotization
        this._authorize = body.authorize
        this._hasAuthorization = null
        delete body.authorize

        //setup function
        this._setup = body.setup || (() => void 0)
        delete body.setup

        // main step
        this._mainStep = step(body)
        this._mainStep.type = this.type
        this._mainStep.description = description

        // audit trail
        this._auditTrail = this._mainStep._auditTrail
        this._auditTrail.type = this.type
        this._auditTrail.description = description
        this._auditTrail.transactionId = uuidv4()
    }

    authorize(user) {
        this._hasAuthorization = false
        this._auditTrail.user = { ...user }
        if (this._authorize) {
            const ret = this._authorize(user)
            if (ret.isOk) this._hasAuthorization = true
        }
        return this._auditTrail.authorized = this._hasAuthorization
    }

    run(request) {

        if ((this._hasAuthorization === false) ||
            (this._authorize && this._hasAuthorization === null))
            return Err('Not Authorized')

        if (request) {
            const requestSchema = schema(this._requestSchema)
            requestSchema.validate(request)
            if (!requestSchema.isValid) return Err({ request: requestSchema.errors })
            this._mainStep.context.req = request
        }

        this._setup(this._mainStep.context)

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
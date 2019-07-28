const { Ok, Err } = require('./results')

class UseCase {

    constructor(description, body) {
        this.description = description
        this._body = body
    }

    run() {
        const steps = Object.entries(this._body)
        for (const step of steps) {
            const ret = step[1].run()
            if (ret.isErr) return ret 
        }
        return Ok()
    }

}

const usecase = (description, body) => {
    return new UseCase(description, body)
}

module.exports = { usecase }
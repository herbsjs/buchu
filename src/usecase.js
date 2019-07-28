const { step } = require('./step')
const { Ok, Err } = require('./results')

class UseCase {

    constructor(description, body) {
        this.description = description
        this.mainStep = step(body)
    }

    run() {
        return this.mainStep.run()
    }

    doc() {

        const usecase = {
            description: this.description,
            steps: this.mainStep.doc()
        }

        return usecase;
    }

}

const usecase = (description, body) => {
    return new UseCase(description, body)
}

module.exports = { usecase }
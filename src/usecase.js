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

        // const steps = Object.entries(this._body)
        // for (const step of steps) {
        //     const ret = step[1].doc()
        //     if (ret)
        //         usecase.steps.push({ description: step[0], steps: ret })
        //     else
        //         usecase.steps.push({ description: step[0] })
        // }

        return usecase;
    }

}

const usecase = (description, body) => {
    return new UseCase(description, body)
}

module.exports = { usecase }
const AsyncFunction = (async () => {}).constructor;
const GeneratorFunction = (function* () {}).constructor;

const isAsyncFunction = value => value instanceof AsyncFunction;
const isGeneratorFunction = value => value instanceof GeneratorFunction;

module.exports = { isAsyncFunction, isGeneratorFunction }
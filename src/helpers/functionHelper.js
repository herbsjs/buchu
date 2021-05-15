const AsyncFunction = (async () => {}).constructor
const isAsyncFunction = value => value instanceof AsyncFunction

module.exports = { isAsyncFunction }
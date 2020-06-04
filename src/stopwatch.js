const namedPerformances = {}
const defaultName = 'default'

const stopwatch = () => {
  return {
    start: (name) => {
      name = name || defaultName
      namedPerformances[name] = {
        startAt: process.hrtime(),
      }
    },
    stop: (name) => {
      name = name || defaultName
      const startAt =
        namedPerformances[name] && namedPerformances[name].startAt
      if (!startAt) throw new Error('Namespace: ' + name + ' doesnt exist')
      const diff = process.hrtime(startAt)
      const time = diff[0] * 1e3 + diff[1] * 1e-6

      return {
        name: name,
        time: time,
      }
    },
  }
}

module.exports = stopwatch()

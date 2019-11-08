const root_path = '.'

const Accessors = require(root_path + '/accessors')

const [getSize, setSize] = Accessors.create()
const [getArray, setArray] = Accessors.create()

const empty = (size) => {
  const a = {}

  setSize(size, a)
  setArray([], a)

  return a
}

const push = (val, a) => {
  const array = getArray(a)

  if (array.length === getSize(a)) {
    array.shift()
  }
  array.push(val)
}

const average = (a) => {
  const array = getArray(a)

  return array.reduce((acc, val) => acc+val) / array.length
}

module.exports = {
  empty,
  push,
  average,
}


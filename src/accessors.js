
const create = (str) => {
  const key = Symbol(str)
  const get = (a) => a[key]
  const set = (val, a) => a[key] = val
  const update = (f, a) => set(f(get(a)), a)

  return [get, set, update]
}

module.exports = {
  create,
}
const root_path = '.'

const Accessors = require(root_path + '/accessors')
const Hit = require(root_path + '/hit')

const [getNumberOfHits, setNumberOfHits, updateNumberOfHits] = Accessors.create()
const [getNumberOfErrors, setNumberOfErrors, updateNumberOfErrors] = Accessors.create()

const getErrorRate = (a) => getNumberOfErrors(a) / getNumberOfHits(a)

const empty = () => {
  const a = {}

  setNumberOfHits(0, a)
  setNumberOfErrors(0, a)

  return a
}


const fromHits = (hits) => {
  const ans = {}

  hits.forEach((hit) => {
    const section = Hit.getSection(hit)

    if (ans[section] === undefined) {
      ans[section] = empty()
    }

    updateNumberOfHits(a=>a+1, ans[section])
    if (Hit.hasErrorStatus(hit)) {
      updateNumberOfErrors(a=>a+1, ans[section])
    }
  })

  return ans
}

const forEachSection = (f, a) => {
  const sections = Object.keys(a)
  sections.forEach((section) => f(a[section], section, a))
}

const mostVisitedSection = (a) => {
  let ans
  forEachSection((a, section) => {
    if (ans === undefined) {
      ans = section
    }
    if (getNumberOfHits(a[ans]) < getNumberOfHits(a)) {
      ans = section
    }
  }, a)

  return ans
}

module.exports = {
  
}

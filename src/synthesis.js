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


const [getTotalBytes, setTotalBytes, updateTotalBytes] = Accessors.create()
const [getTotalHits, setTotalHits, updateTotalHits] = Accessors.create()

const fromHits = (hits) => {
  const ans = {}

  setTotalBytes(0, ans)
  setTotalHits(0, ans)

  hits.forEach((hit) => {
    const section = Hit.getSection(hit)

    if (ans[section] === undefined) {
      ans[section] = empty()
    }

    updateNumberOfHits(a=>a+1, ans[section])
    if (Hit.hasErrorStatus(hit)) {
      updateNumberOfErrors(a=>a+1, ans[section])
    }

    const bytes = Hit.getBytes(hit)
    updateTotalBytes(a=>a+bytes, ans)
    updateTotalHits(a=>a+1, ans)
  })

  return ans
}

const forEachSection = (f, a) => {
  const sections = Object.keys(a)
  sections.forEach((section) => f(a[section], section, a))
}


const xMostVisitedSections = (x, synth) => {
  const compareNumberOfHits = (a, b) => {
    a = getNumberOfHits(a[0])
    b = getNumberOfHits(b[0])
    if (a < b) {
      return -1
    } else if (a === b) {
      return 0
    } else {
      return 1
    }
  }

  let ans = []
  forEachSection((a, section) => {
    ans.push([a, section])
  }, synth)

  ans.sort(compareNumberOfHits)
  ans = ans.slice(-x)
  ans = ans.map(([a, section]) => {
    return [section, getNumberOfHits(a), getErrorRate(a)]
  })

  return ans
}

const toStr = (a) => {
  const most_visited = xMostVisitedSections(10, a).reverse()
  let str = ''
  str += 'Sections of the web site that are the most visited during the last 10 seconds :\n'
  str += '(name of the section) | (number of hits) | (error ratio)\n'
  most_visited.forEach((a) => {
    str += a.join(' ') + '\n' 
  })

  str += 'Total number of bytes transferred during the last 10 seconds : '+getTotalBytes(a)+'\n'
  str += 'Total number of hits during the last 10 seconds : '+getTotalHits(a)+'\n'

  return str
}

module.exports = {
  fromHits,
  xMostVisitedSections,
  getTotalHits,
  toStr,
}

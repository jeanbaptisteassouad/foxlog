const root_path = '..'

const Hit = require(root_path + '/logics/hit')

const filterHits = (in_the_last_ms, epoch, hits) => {
  return hits.filter((hit) =>
    epoch - in_the_last_ms <= Hit.getEpoch(hit) && Hit.getEpoch(hit) <= epoch)  
}

const xMostVisitedSections = (x, in_the_last_ms, epoch, hits) => {
  hits = filterHits(in_the_last_ms, epoch, hits)

  let section_to_hit_x_err = {}
  hits.forEach((hit) => {
    const section = Hit.getSection(hit)

    if (section_to_hit_x_err[section] === undefined) {
      section_to_hit_x_err[section] = [0, 0]
    }

    section_to_hit_x_err[section][0]++
    if (Hit.hasErrorStatus(hit)) {
      section_to_hit_x_err[section][1]++
    }
  })

  let ans = []
  Object.keys(section_to_hit_x_err).forEach((section) => {
    ans.push([section_to_hit_x_err[section], section])
  })

  const compareNumberOfHits = (a, b) => {
    a = a[0][0]
    b = b[0][0]
    if (a < b) {
      return -1
    } else if (a === b) {
      return 0
    } else {
      return 1
    }
  }
  ans.sort(compareNumberOfHits)
  ans = ans.slice(-x)
  ans = ans.map(([hit_x_err, section]) =>
    [section, hit_x_err[0], hit_x_err[1] / hit_x_err[0]]
  )

  return ans.reverse()
}

const totalHits = (in_the_last_ms, epoch, hits) => {
  hits = filterHits(in_the_last_ms, epoch, hits)

  return hits.length
}

const totalBytes = (in_the_last_ms, epoch, hits) => {
  hits = filterHits(in_the_last_ms, epoch, hits)

  return hits.map(Hit.getBytes).reduce((acc, val) => acc + val, 0)
}

const averageHitPerSec = (in_the_last_ms, epoch, hits) => {
  const in_the_last_s = in_the_last_ms / 1000

  return totalHits(in_the_last_ms, epoch, hits) / in_the_last_s
}

module.exports = {
  filterHits,

  xMostVisitedSections,
  totalHits,
  totalBytes,
  averageHitPerSec,
}

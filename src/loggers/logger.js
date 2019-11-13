
const mostVisitedSections = (most_visited_sections, in_the_last_ms) => {
  const in_the_last_s = in_the_last_ms / 1000

  let str = ''
  str += 'Sections of the web site that are the most visited during the last '+in_the_last_s+' seconds :\n'
  str += '(name of the section) | (number of hits) | (error ratio)\n'
  str += most_visited_sections.map(a=>a.join(' ')).join('\n')

  return str
}

const totalBytes = (total_bytes, in_the_last_ms) => {
  const in_the_last_s = in_the_last_ms / 1000

  return 'Total number of bytes transferred during the last '+in_the_last_s+' seconds : '+total_bytes
}

const totalHits = (total_hits, in_the_last_ms) => {
  const in_the_last_s = in_the_last_ms / 1000

  return 'Total number of hits during the last '+in_the_last_s+' seconds : '+total_hits 
}

const alerts = (alerts) => {
  let str = ''

  str += 'Average hits per seconds alerts historic : \n'

  if (alerts.length === 0) {
    str += '-- No Alerts --'
    return str
  }

  str += alerts.map(a => {
    const time = new Date(a[0])
    if (a.length === 2) {
      const value = a[1]
      return `High traffic generated an alert - average hits per seconds = ${value}, triggered at ${time}`
    } else {
      return `Traffic back to normal at ${time}`
    }
  }).join('\n')

  return str
}

module.exports = {
  mostVisitedSections,
  totalBytes,
  totalHits,
  alerts,
}

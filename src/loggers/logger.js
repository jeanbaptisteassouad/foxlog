
const log = (most_visited_sections, total_hits, total_bytes, in_the_last_ms) => {
  const in_the_last_s = in_the_last_ms / 1000

  let str = ''
  str += 'Sections of the web site that are the most visited during the last '+in_the_last_s+' seconds :\n'
  str += '(name of the section) | (number of hits) | (error ratio)\n'
  most_visited_sections.forEach((a) => {
    str += a.join(' ') + '\n' 
  })

  str += 'Total number of bytes transferred during the last '+in_the_last_s+' seconds : '+total_bytes+'\n'
  str += 'Total number of hits during the last '+in_the_last_s+' seconds : '+total_hits+'\n'

  return str
}

module.exports = {
  log,
}

const root_path = '.'

const HttpAccessLog = require(root_path + '/parsers/http-access-log')
const Hit = require(root_path + '/logics/hit')
const Synthesis = require(root_path + '/logics/synthesis')
const Logger = require(root_path + '/loggers/logger')



const default_log_path = '/tmp/access.log'
let path = default_log_path
if (process.argv[2] !== undefined) {
  path = process.argv[2]
}

// let hit_per_second_limit = 10
// if (process.argv[3] !== undefined) {
//   hit_per_second_limit = process.argv[3]
// }

const tail = (lineCallback) => {
  const Tail = require('tail').Tail

  const tail = new Tail(path)

  tail.on('line', (data) => {
    lineCallback(data)
  })

  tail.on('error', (error) => {
    throw new Error(error)
  })
}


let hits = []
tail((line) => {
  try {
    hits.push(Hit.fromHttpAccessLog(HttpAccessLog.fromStr(line)))
  } catch (e) {

  }
})


// const refresh_ms = 10000
// const filter_threshold_ms = 120000

const refresh_ms = 1000
const filter_threshold_ms = 12000

// we use 12 for the size of the window,
// because refresh_ms * window_size must equal
// 2 minute
// const window_size = 12

// const hit_per_10_seconds_limit = hit_per_second_limit * 10
// let hits_tracker = AverageHitTracker.empty(hit_per_10_seconds_limit, window_size)


setInterval(() => {
  // const synthesis = Synthesis.fromHits(hits)

  // AverageHitTracker.pushHitNumber(Synthesis.getTotalHits(synthesis), hits_tracker)


  const now = new Date().getTime()
  const in_the_last_ms = refresh_ms

  const most_visited_sections = Synthesis.xMostVisitedSections(10, in_the_last_ms, now, hits)
  const total_hits = Synthesis.totalHits(in_the_last_ms, now, hits)
  const total_bytes = Synthesis.totalBytes(in_the_last_ms, now, hits)

  const average_hit_per_sec = Synthesis.averageHitPerSec(filter_threshold_ms, now, hits)
  console.log(average_hit_per_sec)

  console.log(Logger.log(most_visited_sections, total_hits, total_bytes, in_the_last_ms))
  // console.log(AverageHitTracker.toStr(hits_tracker))
  // console.log(Synthesis.toStr(synthesis))

  hits = Synthesis.filterHits(filter_threshold_ms, now, hits)
}, refresh_ms)



require(root_path + '/loggers/fake-log-gen').start(500, path) /////////////////




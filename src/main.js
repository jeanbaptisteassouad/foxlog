const root_path = '.'

const HttpAccessLog = require(root_path + '/http-access-log')
const Hit = require(root_path + '/hit')
const Synthesis = require(root_path + '/synthesis')
const AverageHitTracker = require(root_path + '/average-hit-tracker')



const default_log_path = '/tmp/access.log'
let path = default_log_path
if (process.argv[2] !== undefined) {
  path = process.argv[2]
}

let hit_per_second_limit = 10
if (process.argv[3] !== undefined) {
  hit_per_second_limit = process.argv[3]
}




let lines = []
const startToWatchFile = () => {
  Tail = require('tail').Tail

  tail = new Tail(path)

  tail.on('line', (data) => {
    lines.push(data)
  })

  tail.on('error', (error) => {
    throw new Error(error)
  })
}


// to extract log logic from synthesis and average-hit-tracker

// a chaque line on push un hit
// on peut avoir des stats en fonction des dates

const refresh_ms = 10000

// we use 12 for the size of the window,
// because refresh_ms * window_size must equal
// 2 minute
const window_size = 12

const hit_per_10_seconds_limit = hit_per_second_limit * 10
let hits_tracker = AverageHitTracker.empty(hit_per_10_seconds_limit, window_size)

const loop = () => {
  setInterval(() => {
    const hals = []
    lines.forEach((line) => {
      try {
        hals.push(HttpAccessLog.parse(line))
      } catch (e) {

      }
    })
    const hits = hals.map(Hit.fromHttpAccessLog)

    const synthesis = Synthesis.fromHits(hits)

    AverageHitTracker.pushHitNumber(Synthesis.getTotalHits(synthesis), hits_tracker)

    console.log(AverageHitTracker.toStr(hits_tracker))
    console.log(Synthesis.toStr(synthesis))

    lines = []
  }, refresh_ms)
}


startToWatchFile()
loop()


require(root_path + '/fake-log-gen').start(500, path) /////////////////




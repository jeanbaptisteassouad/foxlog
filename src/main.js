const root_path = '.'

const HttpAccessLog = require(root_path + '/parsers/http-access-log')

const Hit = require(root_path + '/logics/hit')
const Synthesis = require(root_path + '/logics/synthesis')
const AlertManager = require(root_path + '/logics/alert-manager')

const Logger = require(root_path + '/loggers/logger')


//==============================//
// Console Arguments Management //
//==============================//

const default_log_path = '/tmp/access.log'
let path = default_log_path
if (process.argv[2] !== undefined) {
  path = process.argv[2]
}

let hit_per_second_limit = 10
if (process.argv[3] !== undefined) {
  hit_per_second_limit = Number(process.argv[3])
  if (isNaN(hit_per_second_limit)) {
    throw new Error('hit_per_second_limit : "'+hit_per_second_limit+'" is not a number')
  }
}

if (process.argv[4] === 'true') {
  require(root_path + '/loggers/fake-log-gen').start(500, path)
}

//===============//
// Tail the file //
//===============//

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
let alert_manager = AlertManager.create(hit_per_second_limit)
tail((line) => {
  try {
    hits.push(Hit.fromHttpAccessLog(HttpAccessLog.fromStr(line)))
  } catch (e) {

  }
})


const refresh_ms = 10000
const filter_threshold_ms = 120000

//===========//
// Main Loop //
//===========//

setInterval(() => {
  const now = new Date().getTime()
  const in_the_last_ms = refresh_ms

  const most_visited_sections = Synthesis.xMostVisitedSections(10, in_the_last_ms, now, hits)
  const total_hits = Synthesis.totalHits(in_the_last_ms, now, hits)
  const total_bytes = Synthesis.totalBytes(in_the_last_ms, now, hits)

  const average_hit_per_sec = Synthesis.averageHitPerSec(filter_threshold_ms, now, hits)

  AlertManager.push(average_hit_per_sec, now, alert_manager)

  let str = ''
  str += '-----------------------------\n'
  const alerts_string = Logger.alerts(AlertManager.getAlerts(alert_manager))
  str += alerts_string
  if (alerts_string !== '') {
    str += '\n\n'
  }

  str += Logger.mostVisitedSections(most_visited_sections, in_the_last_ms)+'\n'
  str += '\n'
  str += Logger.totalBytes(total_bytes, in_the_last_ms)+'\n'
  str += '\n'
  str += Logger.totalHits(total_hits, in_the_last_ms)+'\n'
  str += '-----------------------------'

  console.log(str)

  hits = Synthesis.filterHits(filter_threshold_ms, now, hits)
}, refresh_ms)



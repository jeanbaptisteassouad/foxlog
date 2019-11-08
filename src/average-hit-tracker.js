const root_path = '.'

const Accessors = require(root_path + '/accessors')
const MovingAverage = require(root_path + '/moving-average')

const [getMovingAverage, setMovingAverage] = Accessors.create()
const [getLimit, setLimit] = Accessors.create()
const [getEvent, setEvent] = Accessors.create()
const [getHasCross, setHasCross] = Accessors.create()

const empty = (limit, window_size) => {
  const a = {}

  setMovingAverage(MovingAverage.empty(window_size), a)
  setLimit(limit, a)
  setEvent([], a)
  setHasCross(false, a)

  return a
}

const pushHitNumber = (hit_num, a) => {
  MovingAverage.push(hit_num, getMovingAverage(a))
  checkLimit(a)
}

const checkLimit = (a) => {
  const average = MovingAverage.average(getMovingAverage(a))
  if (getLimit(a) <= average) {
    getEvent(a).push([new Date(), average])
    setHasCross(true, a)
  } else {
    if (getHasCross(a)) {
      getEvent(a).push([new Date()])
      setHasCross(false, a)
    }
  }
}

const toStr = (a) => {
  let str = ''
  const event = getEvent(a)

  if (0 < event.length) {
    str += 'Alerts :\n'
  }
  event.forEach((a) => {
    if (a.length === 2) {
      str += 'High trafic alert - hits = '+a[1]+', triggered at '+a[0]+'\n'
    } else {
      str += 'Trafic is back to normal at '+a[0]+'\n'
    }
  })

  return str
}


module.exports = {
  empty,
  pushHitNumber,
  toStr,
}

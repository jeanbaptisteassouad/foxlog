const root_path = '..'

const Accessors = require(root_path + '/accessors')

const [getThreshold, setThreshold] = Accessors.create()
const [getAlerts, setAlerts] = Accessors.create()
const [getHasBeenCrossed, setHasBeenCrossed] = Accessors.create()

const create = (threshold) => {
  const a = {}

  setThreshold(threshold, a)
  setAlerts([], a)
  setHasBeenCrossed(false, a)

  return a
}

const push = (average_hit_per_sec, now, alert_manager) => {
  const threshold = getThreshold(alert_manager)
  const alerts = getAlerts(alert_manager)

  if (threshold <= average_hit_per_sec) {
    alerts.push([now, average_hit_per_sec])
    setHasBeenCrossed(true, alert_manager)
  } else if (getHasBeenCrossed(alert_manager) && average_hit_per_sec < threshold) {
    alerts.push([now])
    setHasBeenCrossed(false, alert_manager)
  }
}

module.exports = {
  create,
  push,
  getAlerts,
}
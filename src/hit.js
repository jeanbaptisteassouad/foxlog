const root_path = '.'

const Accessors = require(root_path + '/accessors')
const HttpAccessLog = require(root_path + '/http-access-log')

const [getSection, setSection] = Accessors.create()
const [getStatus, setStatus] = Accessors.create()

const empty = () => {
  const a = {}

  setSection('/default', a)
  setStatus(200, a)

  return a
}

const fromHttpAccessLog = (hal) => {
  const a = empty()

  const section = HttpAccessLog.getSection(hal)
  const status = HttpAccessLog.getStatus(hal)

  setSection(section, a)
  setStatus(Number(status), a)

  return a
}

const hasErrorStatus = (a) => {
  const isClientError = (status) => 400 <= status && status <= 499
  const isServerError = (status) => 500 <= status && status <= 599

  const status = getStatus(a)

  return isClientError(status) || isServerError(status)
}

module.exports = {
  fromHttpAccessLog,

  getSection,

  hasErrorStatus,
}
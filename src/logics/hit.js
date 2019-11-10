const root_path = '..'

const Accessors = require(root_path + '/accessors')
const HttpAccessLog = require(root_path + '/parsers/http-access-log')

const [getSection, setSection] = Accessors.create()
const [getStatus, setStatus] = Accessors.create()
const [getBytes, setBytes] = Accessors.create()
const [getEpoch, setEpoch] = Accessors.create()

const empty = () => {
  const a = {}

  setSection('/default', a)
  setStatus(200, a)
  setEpoch(0, a)
  setBytes(0, a)

  return a
}

const fromHttpAccessLog = (hal) => {
  const a = empty()

  const epoch = HttpAccessLog.getEpoch(hal)
  const section = HttpAccessLog.getSection(hal)
  const status = HttpAccessLog.getStatus(hal)
  const bytes = HttpAccessLog.getBytes(hal)

  setEpoch(epoch, a)
  setSection(section, a)
  setStatus(Number(status), a)
  setBytes(Number(bytes), a)

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
  getBytes,
  getEpoch,

  hasErrorStatus,
}
const root_path = '..'

const HttpAccessLog = require(root_path + '/parsers/http-access-log')
const Fs = require('fs')

const start = (period_ms, path) => {
  const callback = () => {
    Fs.writeFileSync(path, HttpAccessLog.random() + '\n', {flag:'a'})
    setTimeout(callback, period_ms * (0.5 + Math.random()))
  }

  callback()
}


module.exports = {
  start,
}



// https://www.w3.org/Daemon/User/Config/Logging.html

const root_path = '..'
const HttpAccessDate = require(root_path + '/parsers/http-access-date')

const pick = (array) => {
  const i = Math.floor(Math.random() * array.length)
  return array[i]
}

const random = () => {
  const remotehost = '127.0.0.1'
  const rfc931 = '-'
  const authuser = pick(['james', 'jill', 'frank', 'mary'])
  const date = '['+HttpAccessDate.toStr(HttpAccessDate.create(new Date().getTime()))+']'
  const request = '"' + pick(['GET', 'POST']) + ' '+pick(['/report', '/api/user']) + ' HTTP/1.0"'
  const status = pick(['200', '400', '500', '300'])
  const bytes = pick(['123', '15', '656'])

  return [
    remotehost,
    rfc931,
    authuser,
    date,
    request,
    status,
    bytes
  ].join(' ')
}


const many_no_space = '([^ ]+)'

const remotehost = many_no_space
const rfc931 = many_no_space
const authuser = many_no_space
const date = '\\[([^\\[\\]]*)\\]'
const request = '"([^"]*)"'
const status = many_no_space
const bytes = many_no_space

const http_access_log = [remotehost, rfc931, authuser, date, request, status, bytes].join(' ')


const request_method = many_no_space
const request_uri = many_no_space
const request_rest = many_no_space

const request_content = [request_method, request_uri, request_rest].join(' ')

const fromStr = (str) => {
  const match = str.match(http_access_log)
  if (match === null) {
    throw new Error('the parser has failed, the string "'+str+'" is not an http access log')
  }

  const remotehost = match[1]
  const rfc931 = match[2]
  const authuser = match[3]
  const date = match[4]
  const request = match[5]
  const status = match[6]
  const bytes = match[7]


  const match2 = request.match(request_content)
  if (match2 === null) {
    throw new Error('the parser has failed to parse the request "'+getRequest(ans)+'"')
  }

  const request_method = match2[1]
  const request_uri = match2[2]
  const request_rest = match2[3]

  const had = HttpAccessDate.fromStr(date)

  return [
    remotehost,
    rfc931,
    authuser,
    had,
    request_method,
    request_uri,
    request_rest,
    status,
    bytes,
  ]
}

const getRemotehost = a => a[0]
const getRfc931 = a => a[1]
const getAuthuser = a => a[2]

const getHad = a => a[3]
const getEpoch = a => HttpAccessDate.getEpoch(getHad(a))

const getRequestMethod = a => a[4]
const getRequestUri = a => a[5]
const getSection = a => getRequestUri(a).split('/').slice(0,2).join('/')
const getRequestRest = a => a[6]
const getStatus = a => a[7]
const getBytes = a => a[8]

const toStr = (a) => {
  const remotehost = getRemotehost(a)
  const rfc931 = getRfc931(a)
  const authuser = getAuthuser(a)
  const date = '['+HttpAccessDate.toStr(getHad(a))+']'
  const request = '"'+getRequestMethod(a)+' '+getRequestUri(a)+' '+getRequestRest(a)+'"'
  const status = getStatus(a)
  const bytes = getBytes(a)

  return [
    remotehost,
    rfc931,
    authuser,
    date,
    request,
    status,
    bytes
  ].join(' ')
}

module.exports = {
  random,

  fromStr,

  getEpoch,
  getSection,
  getStatus,
  getBytes,

  toStr,
}
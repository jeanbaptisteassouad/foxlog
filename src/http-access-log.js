
// https://www.w3.org/Daemon/User/Config/Logging.html

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

const request_content = [request_method, request_uri].join(' ')

const parse = (str) => {
  const match = str.match(http_access_log)
  if (match === null) {
    throw new Error('the parser has failed, the string "'+str+'" is not an http access log')
  }

  const ans = match.slice(1, 8)

  const match2 = getRequest(ans).match(request_content)
  if (match2 === null) {
    throw new Error('the parser has failed to parse the request "'+getRequest(ans)+'"')
  }

  ans.push(match2[1])
  ans.push(match2[2])

  const section = getRequestUri(ans).split('/').slice(0,2).join('/')
  ans.push(section)

  return ans
}

const getRemotehost = a => a[0]
const getRfc931 = a => a[1]
const getAuthuser = a => a[2]
const getDate = a => a[3]
const getRequest = a => a[4]
const getStatus = a => a[5]
const getBytes = a => a[6]
const getRequestMethod = a => a[7]
const getRequestUri = a => a[8]
const getSection = a => a[9]

module.exports = {
  parse,

  getRemotehost,
  getRfc931,
  getAuthuser,
  getDate,
  getRequest,
  getStatus,
  getBytes,
  getRequestMethod,
  getRequestUri,
  getSection,
}
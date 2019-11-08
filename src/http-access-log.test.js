const chai = require('chai')
const expect = chai.expect

const root_path = '.'
const HttpAccessLog = require(root_path + '/http-access-log')


describe('HttpAccessLog', () => {
  const test = (str, array) => it('.parse('+str+')', () => {
    const ans = HttpAccessLog.parse(str)

    expect(HttpAccessLog.getRemotehost(ans)).to.equal(array[0])
    expect(HttpAccessLog.getRfc931(ans)).to.equal(array[1])
    expect(HttpAccessLog.getAuthuser(ans)).to.equal(array[2])
    expect(HttpAccessLog.getDate(ans)).to.equal(array[3])
    expect(HttpAccessLog.getRequest(ans)).to.equal(array[4])
    expect(HttpAccessLog.getStatus(ans)).to.equal(array[5])
    expect(HttpAccessLog.getBytes(ans)).to.equal(array[6])

    expect(HttpAccessLog.getRequestMethod(ans)).to.equal(array[7])
    expect(HttpAccessLog.getRequestUri(ans)).to.equal(array[8])
    expect(HttpAccessLog.getSection(ans)).to.equal(array[9])
  })

  test(
    '127.0.0.1 - james [09/May/2018:16:00:39 +0000] "GET /report HTTP/1.0" 200 123',
    [
      '127.0.0.1',
      '-',
      'james',
      '09/May/2018:16:00:39 +0000',
      'GET /report HTTP/1.0',
      '200',
      '123',
      'GET',
      '/report',
      '/report'
    ]
  )

  test(
    '127.0.0.1 - jill [09/May/2018:16:00:41 +0000] "GET /api/user HTTP/1.0" 200 234',
    [
      '127.0.0.1',
      '-',
      'jill',
      '09/May/2018:16:00:41 +0000',
      'GET /api/user HTTP/1.0',
      '200',
      '234',
      'GET',
      '/api/user',
      '/api',
    ]
  )

  test(
    '127.0.0.1 - frank [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 200 34',
    [
      '127.0.0.1',
      '-',
      'frank',
      '09/May/2018:16:00:42 +0000',
      'POST /api/user HTTP/1.0',
      '200',
      '34',
      'POST',
      '/api/user',
      '/api',
    ]
  )

  test(
    '127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12',
    [
      '127.0.0.1',
      '-',
      'mary',
      '09/May/2018:16:00:42 +0000',
      'POST /api/user HTTP/1.0',
      '503',
      '12',
      'POST',
      '/api/user',
      '/api',
    ]
  )

  expect(() =>
    test(
      '127.0.0.1 - bad formated [ht]tp access log "POST /api/user HTTP/1.0" 503 12',
      []
    )
  ).to.throw
  
})
const chai = require('chai')
const expect = chai.expect

const root_path = '.'
const HttpAccessLog = require(root_path + '/http-access-log')
const Hit = require(root_path + '/hit')

describe('Hit', () => {
  const test = (str, array) => it(str, () => {
    const ans = Hit.fromHttpAccessLog(HttpAccessLog.parse(str))

    expect(Hit.getSection(ans)).to.equal(array[0])
    expect(Hit.hasErrorStatus(ans)).to.equal(array[1])
    expect(Hit.getBytes(ans)).to.equal(array[2])
  })

  test(
    '127.0.0.1 - james [09/May/2018:16:00:39 +0000] "GET /report HTTP/1.0" 200 123',
    [
      '/report',
      false,
      123
    ]
  )

  test(
    '127.0.0.1 - jill [09/May/2018:16:00:41 +0000] "GET /api/user HTTP/1.0" 200 234',
    [
      '/api',
      false,
      234
    ]
  )

  test(
    '127.0.0.1 - frank [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 200 34',
    [
      '/api',
      false,
      34
    ]
  )

  test(
    '127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12',
    [
      '/api',
      true,
      12
    ]
  )

})
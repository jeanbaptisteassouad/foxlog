const chai = require('chai')
const expect = chai.expect

const root_path = '..'
const HttpAccessLog = require(root_path + '/parsers/http-access-log')


describe('HttpAccessLog', () => {
  const test = (str, array) => it('toStr(fromStr('+str+')) ==='+str, () => {
    const ans = HttpAccessLog.fromStr(str)

    expect(HttpAccessLog.getEpoch(ans)).to.equal(array[0])
    expect(HttpAccessLog.getSection(ans)).to.equal(array[1])
    expect(HttpAccessLog.getStatus(ans)).to.equal(array[2])
    expect(HttpAccessLog.getBytes(ans)).to.equal(array[3])

    expect(HttpAccessLog.toStr(ans)).to.equal(str)
  })

  test(
    '127.0.0.1 - james [09/May/2018:16:00:39 +0000] "GET /report HTTP/1.0" 200 123',
    [
      new Date(2018, 4, 9, 16, 0, 39).getTime(),
      '/report',
      '200',
      '123'
    ]
  )

  test(
    '127.0.0.1 - jill [09/May/2018:16:00:41 +0000] "GET /api/user HTTP/1.0" 200 234',
    [
      new Date(2018, 4, 9, 16, 0, 41).getTime(),      
      '/api',
      '200',
      '234',
    ]
  )

  test(
    '127.0.0.1 - frank [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 200 34',
    [
      new Date(2018, 4, 9, 16, 0, 42).getTime(),      
      '/api',
      '200',
      '34',
    ]
  )

  test(
    '127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12',
    [
      new Date(2018, 4, 9, 16, 0, 42).getTime(),      
      '/api',
      '503',
      '12',
    ]
  )

  expect(() =>
    test(
      '127.0.0.1 - bad formated [ht]tp access log "POST /api/user HTTP/1.0" 503 12',
      []
    )
  ).to.throw
  
})
const chai = require('chai')
const expect = chai.expect

const root_path = '..'
const HttpAccessLog = require(root_path + '/parsers/http-access-log')
const Hit = require(root_path + '/logics/hit')
const Synthesis = require(root_path + '/logics/synthesis')

describe('Synthesis', () => {
  const test = (str, x, in_the_last_ms, epoch, hal_str_array, array) => it(str, () => {
    const hits = hal_str_array.map(a=>Hit.fromHttpAccessLog(HttpAccessLog.fromStr(a)))

    expect(Synthesis.xMostVisitedSections(x, in_the_last_ms, epoch, hits)).to.deep.equal(array[0])
    expect(Synthesis.totalHits(in_the_last_ms, epoch, hits)).to.deep.equal(array[1])
    expect(Synthesis.totalBytes(in_the_last_ms, epoch, hits)).to.deep.equal(array[2])
    expect(Synthesis.averageHitPerSec(in_the_last_ms, epoch, hits)).to.deep.equal(array[3])
  })

  test(
    'basic synthesis test',
    2,
    3000,
    new Date(2018, 4, 9, 16, 0, 42).getTime(),
    [
      '127.0.0.1 - james [09/May/2018:16:00:39 +0000] "GET /report HTTP/1.0" 200 123',
      '127.0.0.1 - jill [09/May/2018:16:00:41 +0000] "GET /api/user HTTP/1.0" 200 234',
      '127.0.0.1 - frank [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 200 34',
      '127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12',
    ],
    [
      [['/api', 3, 1 / 3], ['/report', 1, 0]],
      4,
      123 + 234 + 34 + 12,
      4 / 3
    ]
  )

  test(
    'basic synthesis test 2',
    2,
    2000,
    new Date(2018, 4, 9, 16, 0, 42).getTime(),
    [
      '127.0.0.1 - james [09/May/2018:16:00:39 +0000] "GET /report HTTP/1.0" 200 123',
      '127.0.0.1 - jill [09/May/2018:16:00:41 +0000] "GET /api/user HTTP/1.0" 200 234',
      '127.0.0.1 - frank [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 200 34',
      '127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12',
    ],
    [
      [['/api', 3, 1 / 3]],
      3,
      234 + 34 + 12,
      3 / 2
    ]
  )
})
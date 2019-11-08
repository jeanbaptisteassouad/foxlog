const chai = require('chai')
const expect = chai.expect

const root_path = '.'
const HttpAccessLog = require(root_path + '/http-access-log')
const Hit = require(root_path + '/hit')
const Synthesis = require(root_path + '/synthesis')

describe('Synthesis', () => {
  const test = (str, x, hal_str_array, array) => it(str, () => {
    const hits = []
    hal_str_array.forEach((str) => {
      hits.push(Hit.fromHttpAccessLog(HttpAccessLog.parse(str)))
    })
    const synthesis = Synthesis.fromHits(hits)

    expect(Synthesis.xMostVisitedSections(x, synthesis)).to.deep.equal(array[0])
    expect(Synthesis.getTotalHits(synthesis)).to.deep.equal(array[1])
  })

  test(
    'basic synthesis test',
    2,
    [
      '127.0.0.1 - james [09/May/2018:16:00:39 +0000] "GET /report HTTP/1.0" 200 123',
      '127.0.0.1 - jill [09/May/2018:16:00:41 +0000] "GET /api/user HTTP/1.0" 200 234',
      '127.0.0.1 - frank [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 200 34',
      '127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12',
    ],
    [
      [['/report', 1, 0], ['/api', 3, 1 / 3]],
      4
    ]
  )
})
const chai = require('chai')
const expect = chai.expect

const root_path = '..'
const HttpAccessDate = require(root_path + '/parsers/http-access-date')


describe('HttpAccessDate', () => {
  const test = (str, array) => it('toStr(fromStr('+str+')) === '+str, () => {
    const ans = HttpAccessDate.fromStr(str)

    expect(HttpAccessDate.getEpoch(ans)).to.equal(array[0])
    expect(HttpAccessDate.toStr(ans)).to.equal(str)
  })

  test(
    '09/May/2018:16:00:39 +0000',
    [
      new Date(2018, 4, 9, 16, 0, 39).getTime(),
    ]
  )

  test(
    '03/Feb/2017:06:03:09 +0000',
    [
      new Date(2017, 1, 3, 6, 3, 9).getTime(),
    ]
  )
  
})
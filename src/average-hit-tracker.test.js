const chai = require('chai')
const expect = chai.expect

const root_path = '.'
const AverageHitTracker = require(root_path + '/average-hit-tracker')

describe('AverageHitTracker', () => {
  const test = (str, args, array) => it(str, () => {
    const a = AverageHitTracker.empty(args.limit, args.window_size)

    args.hits.forEach((hit) => {
      AverageHitTracker.pushHitNumber(hit, a)
    })

    const str = AverageHitTracker.toStr(a)
      .split('\n').slice(1,-1).map(a=>a.match(/[^ ]*/)[0])
    expect(str).to.deep.equal(array[0])
  })

  test(
    'basic logic test',
    {
      limit:2,
      window_size:2,
      hits:[1, 1, 4, 2, 2, 1]
    },
    [
      ['High', 'High', 'High', 'Trafic'],
    ]
  )

  test(
    'advenced logic test',
    {
      limit:2,
      window_size:2,
      hits:[1, 4, 1, 1, 3, 0, 1, 1]
    },
    [
      ['High', 'High', 'Trafic', 'High', 'Trafic'],
    ]
  )

})
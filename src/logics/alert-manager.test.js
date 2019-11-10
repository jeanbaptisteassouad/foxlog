const chai = require('chai')
const expect = chai.expect

const root_path = '..'
const AlertManager = require(root_path + '/logics/alert-manager')


describe('AlertManager', () => {
  const test = (str, threshold, array, ans) => it(str, () => {
    const a = AlertManager.create(threshold)

    array.forEach(([average_hit_per_sec, now]) =>
      AlertManager.push(average_hit_per_sec, now, a))

    expect(AlertManager.getAlerts(a)).to.deep.equal(ans)
  })

  test(
    'basic test',
    2,
    [
      [1, 1000],
      [1, 1010],
      [3, 1020],
      [2, 1030],
      [0.5, 1040],
      [0.5, 1050],
    ],
    [
      [1020, 3],
      [1030, 2],
      [1040]
    ]
  )


  test(
    'more advenced test',
    2,
    [
      [3, 1000],
      [1, 1010],
      [1, 1015],
      [3, 1020],
      [2, 1030],
      [0.5, 1040],
      [0.5, 1050],
    ],
    [
      [1000, 3],
      [1010],
      [1020, 3],
      [1030, 2],
      [1040],
    ]
  )

  
})
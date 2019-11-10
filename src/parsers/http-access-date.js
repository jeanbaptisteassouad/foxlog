


const day = '([0-9]{2})/'
const month = '([^/]*)/'
const year = '([0-9]{4}):'
const hour = '([0-9]{2}):'
const min = '([0-9]{2}):'
const sec = '([0-9]{2}) '

const rest = '(.*)'

const date = [day, month, year, hour, min, sec, rest].join('')

const month_3_letter_to_index = {
  'Jan':0,
  'Feb':1,
  'Mar':2,
  'Apr':3,
  'May':4,
  'Jun':5,
  'Jul':6,
  'Aug':7,
  'Sep':8,
  'Oct':9,
  'Nov':10,
  'Dec':11,
}

const index_to_month_3_letter = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const fromStr = (str) => {
  const match = str.match(date)

  if (match === null) {
    throw new Error('unable to parse the http access date : "'+str+'"')
  }

  const day = Number(match[1])
  const month = month_3_letter_to_index[match[2]]
  const year = Number(match[3])
  const hour = Number(match[4])
  const min = Number(match[5])
  const sec = Number(match[6])
  const rest = match[7]

  const epoch = new Date(year, month, day, hour, min, sec).getTime()

  return [epoch, rest]
}

const getEpoch = (a) => a[0]
const getRest = (a) => a[1]

const zeroPadding2 = (str) => {
  if (str.length === 1) {
    str = '0'+str
  }
  return str
}

const create = (epoch) => {
  return [
    epoch,
    '+0000'
  ]
}

const toStr = (a) => {
  const epoch = getEpoch(a)

  const date = new Date(epoch)

  const day = zeroPadding2(date.getDate().toString())
  const month = index_to_month_3_letter[date.getMonth()]
  const year = date.getFullYear()
  const hour = zeroPadding2(date.getHours().toString())
  const min = zeroPadding2(date.getMinutes().toString())
  const sec = zeroPadding2(date.getSeconds().toString())
  const rest = getRest(a)

  return `${day}/${month}/${year}:${hour}:${min}:${sec} ${rest}`
}


module.exports = {
  fromStr,

  create,

  getEpoch,

  toStr,
}
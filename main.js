const CFonts = require('cfonts')
const fs = require('fs')
const moment = require('moment')
const colors = require('colors')
const axios = require('axios')
const stdin = process.openStdin()
const env = require('./env.json')

const dbPath = __dirname + '/data.json'
const color = '#71bf98'
const colorClock = '#c0c0c0'
const tickInterval = 'minutes'
// const tickInterval = 'seconds'
// @todo Make this dynamic via arguments?

let tickerId = null
let processIgnoreArguments = false
let data = []
let outputString = ''
let latestDateObject = null

const loadData = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([moment()]))
  }
  data = JSON.parse(fs.readFileSync(dbPath).toString())
  latestDateObject = moment(data[data.length - 1])
}

const tick = () => {
  if (tickerId) {
    clearTimeout(tickerId)
  }
  console.clear()
  render()
  tickerId = setTimeout(tick, tickInterval === 'seconds' ? 1000 : 60000) // 60000 = 1 minute.
}

const getClockString = () => {
  return moment().format('HH:mm')
}

const render = () => {
  if (!latestDateObject.format) {
    console.log('NO DATA'.red)
    console.log(JSON.stringify(latestDateObject, null, 2))
    return
  }
  console.log('Latest reset: ' + latestDateObject.format('HH:mm')) + '\n'

  const duration = moment.duration(moment().diff(latestDateObject))
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  outputString = `${leftPad(hours)}:${leftPad(minutes)}${tickInterval === 'seconds' ? ':' + leftPad(seconds) : ''}`

  CFonts.say(outputString, {
    font: 'huge',
    align: 'left',
    colors: [color, color],
    background: 'transparent',
    letterSpacing: 2,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: 'node',
  })

  console.log('Press ENTER to reset.'.bgGray.white + ' (CTRL + C to quit)'.gray)

  if (env.showClock) {
    console.log('\nToday is '.gray + moment().format('dddd').white + '. Current time: '.gray)
    CFonts.say(getClockString(), {
      font: 'huge',
      align: 'left',
      colors: [colorClock, colorClock],
      background: 'transparent',
      letterSpacing: 2,
      lineHeight: 1,
      space: true,
      maxLength: '0',
      gradient: false,
      independentGradient: false,
      transitionGradient: false,
      env: 'node',
    })
  }
}

const leftPad = (number) => {
  return number < 10 ? '0' + number.toString() : number
}

const syncToServer = (latestDateObject) => {
  const latestTimeString = `${moment(latestDateObject).get('hour')}:${moment(latestDateObject).get('minute')}`
  const url = env.remoteUrl
  axios
    .post(
      url,
      {
        dateString: latestTimeString,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      }
    )
    .then((response) => {
      // fs.appendFileSync('server-logs.txt', 'SUCCESS: ' + response.data + '\n')
    })
    .catch((error) => {
      fs.appendFileSync('server-logs.txt', 'ERROR: ' + JSON.stringify(response) + '\n')
    })
}

const addEvent = (momentObject = null) => {
  latestDateObject = momentObject ? momentObject : moment()
  data.push(latestDateObject)
  fs.writeFileSync(dbPath, JSON.stringify(data))
  if (env.remoteUrl) {
    syncToServer(latestDateObject)
  }
  tick()
}

const listenToInput = () => {
  stdin.addListener('data', (d) => {
    addEvent()
  })
}

const processArguments = () => {
  if (!processIgnoreArguments && process.argv[2] && process.argv[2].includes(':')) {
    const inputBits = process.argv[2].split(':')
    const inputToMomentObject = moment()
    inputToMomentObject.hours(Number(inputBits[0]))
    inputToMomentObject.minutes(Number(inputBits[1]))
    addEvent(inputToMomentObject)
    console.clear()
    console.log(`Set latest event time to ${latestDateObject.hours()}:${latestDateObject.minutes()}`.bgWhite.black)
    processIgnoreArguments = true
    setTimeout(init, 2000)
    return true
  }
  return false
}

const init = () => {
  loadData()
  if (processArguments()) {
    return
  }
  listenToInput()
  tick()
}

init()

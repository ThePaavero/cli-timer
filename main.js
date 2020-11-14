const CFonts = require('cfonts')
const fs = require('fs')
const moment = require('moment')
const colors = require('colors')
const stdin = process.openStdin()

const dbPath = __dirname + '/data.json'
const color = '#71bf98'
const tickInterval = 'minutes'
// const tickInterval = 'seconds'

let processIgnoreArguments = false
let data = []
let outputString = '---'
let latestDateObject = null

const loadData = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([moment()]))
  }
  data = JSON.parse(fs.readFileSync(dbPath).toString())
  latestDateObject = moment(data[data.length - 1])
}

const tick = () => {
  console.clear()
  render()
  setTimeout(tick, tickInterval === 'seconds' ? 1000 : 60000) // 60000 = 1 minute.
}

const render = () => {

  if (!latestDateObject.format) {
    console.log('NO DATA'.red)
    console.log(JSON.stringify(latestDateObject, null, 2))
    return
  }
  console.log('Latest: ' + latestDateObject.format('HH:mm')) + '\n'

  const duration = moment.duration(moment().diff(latestDateObject))
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  outputString = `${leftPad(hours)}:${leftPad(minutes)}${tickInterval === 'seconds' ? ':' + leftPad(seconds) : ''}`

  CFonts.say(outputString, {
    font: 'huge',
    align: 'center',
    colors: [color, color],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: 'node'
  })

  console.log('Press ENTER to reset.'.gray)
}

const leftPad = (number) => {
  return number < 10 ? '0' + number.toString() : number
}

const addEvent = (momentObject = null) => {
  latestDateObject = momentObject ? momentObject : moment()
  data.push(latestDateObject)
  fs.writeFileSync(dbPath, JSON.stringify(data))
}

const listenToInput = () => {
  stdin.addListener('data', (d) => {
    addEvent()
  })
}

const init = () => {
  loadData()
  
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
    return
  }
  
  listenToInput()
  tick()
}

init()

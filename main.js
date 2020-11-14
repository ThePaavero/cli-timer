const CFonts = require('cfonts')
const fs = require('fs')
const moment = require('moment')
const stdin = process.openStdin()

const dbPath = __dirname + '/data.json'
const colors = [
  '#eb3434',
  '#eb3434'
]
let data = []
let outputString = '---'
let latestDateObject = {}

const loadData = () => {
  // Create our data file if it doesn't exist yet.
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]))
  }
  // Populate our model.
  data = JSON.parse(fs.readFileSync(dbPath).toString())
}

const tick = () => {
  console.clear()
  render(outputString)
  setTimeout(tick, 1000)
}

const render = (data) => {
  CFonts.say(data, {
    font: 'huge',
    align: 'left',
    colors,
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
}

const addEvent = (input) => {
  fs.appendFileSync('debug.txt', input.toString() + '\n')
  latestDateObject = moment()
  data.push(latestDateObject)
  fs.writeFileSync(dbPath, JSON.stringify(data))
}

const listenToInput = () => {
  stdin.addListener('data', (d) => {
    addEvent(d.toString())
  })
}

const init = () => {
  listenToInput()
  tick()
}

init()

const CFonts = require('cfonts')
const fs = require('fs')
const stdin = process.openStdin()

const dbPath = __dirname + '/data.json'
let data = []

const loadData = () => {
  // Create our data file if it doesn't exist yet.
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]))
  }
  data = JSON.parse(fs.readFileSync(dbPath).toString())
}

const tick = () => {
  console.clear()
  render()
  setTimeout(tick, 1000)
}

const render = (data) => {
  CFonts.say('03:12', {
    font: 'huge',              // define the font face
    align: 'left',              // define text alignment
    colors: ['system'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1,           // define letter spacing
    lineHeight: 1,              // define the line height
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '0',             // define how many character can be on one line
    gradient: false,            // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false,  // define if this is a transition between colors directly
    env: 'node'                 // define the environment CFonts is being executed in
  })
}

const addEvent = (input) => {
  fs.appendFileSync('debug.txt', input.toString() + '\n')
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

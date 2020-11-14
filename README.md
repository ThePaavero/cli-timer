# CLI Timer
![Screenshot](https://raw.githubusercontent.com/ThePaavero/cli-timer/master/screenshot.gif)

## Install
* Clone or download the repository.
* `npm i`

## Run
* Normal case: `node main.js`
* Manually override the latest event: `node main.js 19:25`

---

## Packages used
* [moment](https://github.com/moment/moment/)
* [cfonts](https://github.com/dominikwilkowski/cfonts)
* [colors](https://github.com/Marak/colors.js)

## Notes
* We keep adding event timestamps to a JSON file. Why? Some plans for using the data for some kind of history graph or something. Need to implement some rotation logic so we don't end up with a huge file/array.

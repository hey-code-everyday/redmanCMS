let window = null

if (process.browser) {
  window = require('./window-shim')
} else {
  window = {
    location: '',
    addEventListener () {},
    removeEventListener () {},
    pageYOffset: 0,
    pageXOffset: 0,
    innerWidth: 1024,
    innerHeight: 768,
    history: {
      back () {}
    }
  }
}

module.exports = window

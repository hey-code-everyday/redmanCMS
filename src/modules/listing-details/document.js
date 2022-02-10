let document = null

if (process.browser) {
  document = require('./document-shim')
} else {
  document = {
    body: {
      addEventListener () {},
      removeEventListener () {}
    },
    documentElement: {
      scrollTop: 0,
      clientTop: 0
    }
  }
}

module.exports = document

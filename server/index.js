const express = require('express')
const path = require('path')
const app = express()
const popsicle = require('popsicle')
const pkg = require('../package.json')
const args = process.argv
const cors = require('cors')

const spaceArgs = args.find(a => a.includes('spaceID'))
const spaceID = spaceArgs
  ? args.find(a => a.includes('spaceID')).split('=')[1]
  : 'rwp-5039'

const isLocal = args.find(a => a.includes('isLocal'))

console.log('Starting test server...')
console.log('SpaceID is...', spaceID)

function getHypervue (pageID, fullUrl) {
  const url = isLocal
    ? 'http://localhost:8473/render/page-builder/1.0'
    : ('https://hyperview.rmcloud.com/render/page-builder/' + pkg.version)

  if (!isLocal) {
    fullUrl = fullUrl.replace('localhost', 'redmantest') // conductor hack
  }

  return popsicle
    .request({
      url,
      method: 'POST',
      body: {
        pageID,
        spaceID,
        requestUrl: fullUrl
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .use(popsicle.plugins.parse('json'))
}

function renderPage (req, res, pageID, fullUrl) {
  console.log('Rendering', pageID, '...')

  getHypervue(pageID, fullUrl).then(response => {
    if (response.body.error) {
      res.send(response.body.error + ': ' + response.body.message)
      return
    }

    const css = isLocal
      ? '/css/app.css'
      : `//cfjs.rmcloud.com/page-builder/${pkg.version}/css/app.css`

    const app = isLocal
      ? '/js/app.js'
      : `//cfjs.rmcloud.com/page-builder/${pkg.version}/js/app.js`

    const vendor = isLocal
      ? '/js/vendor.js'
      : `//cfjs.rmcloud.com/page-builder/${pkg.version}/js/vendor.js`

    const manifest = isLocal
      ? '/js/manifest.js'
      : `//cfjs.rmcloud.com/page-builder/${pkg.version}/js/manifest.js`

    const page = `
      <!DOCTYPE html>
      <html lang="en">
        <head hreflang="en">
          ${response.body.title}
          <link rel="stylesheet" href="//assets.rmcloud.com/frontend/static/assets/css/bulma.0.5.3.css" />
          <link rel="stylesheet" href="//assets.rmcloud.com/frontend/static/assets/fonts/linearicons.css" />
          <link rel="stylesheet" href="//assets.rmcloud.com/frontend/static/assets/fonts/socicons.css" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/quill/1.3.4/quill.bubble.min.css" />
          <link rel="stylesheet" href="${css}" />
          <script src="https://cdn.polyfill.io/v2/polyfill.js" nomodule></script>
          ${response.body.style}
        </head>
        <body>
          ${response.body.html.replace('data-server-rendered="true"', '')}
          ${response.body.script}
          <script>window.__PHOENIX__ = ${JSON.stringify(response.body.state, null, 2)}</script>
          <script src="${manifest}" defer></script>
          <script src="${vendor}" defer></script>
          <script src="${app}" defer></script>
        </body>
      </html>
    `

    res.send(page)
  })
}

app.use(cors())

app.use('*/css', express.static(path.join(__dirname, '../dist-client/css')))
app.use('*/js', express.static(path.join(__dirname, '../dist-client/js')))

app.get('/admin', (req, res) => {
  renderPage(req, res, 'admin')
})

app.get('/favicon.ico', (req, res) => {
  res.status(204)
})

app.get('/:pageID/:year/:day/:month/:postID', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  renderPage(req, res, req.params.pageID, fullUrl)
})
app.get('/:pageID/category/:category', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  renderPage(req, res, req.params.pageID, fullUrl)
})
app.get('/:pageID/:slug', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  renderPage(req, res, req.params.pageID, fullUrl)
})
app.get('/:pageID', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  renderPage(req, res, req.params.pageID, fullUrl)
})
app.get('/search/*', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  renderPage(req, res, 'search', fullUrl)
})
app.get('/agent/:name', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  renderPage(req, res, 'agent', fullUrl)
})
app.get('/agents/*', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  renderPage(req, res, 'agents', fullUrl)
})
app.get('/', (req, res) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  renderPage(req, res, 'index', fullUrl)
})

app.listen(3000, () => console.log('Test server listening on port 3000!'))

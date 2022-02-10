/* eslint-disable */

const popsicle = require('popsicle')
const pkg = require('./package')
const bundle = pkg.bundle

const url = 'https://grandcentral-preview.rmcloud.com/app/website/environment/production/component/'
const body = {
  stateKey: bundle.stateKey,
  bodyClass: bundle.bodyClass,
  version: {
    name: pkg.name,
    buildDate: new Date().toString(),
    version: pkg.version
  },
  scripts: bundle.scripts,
  css: bundle.css
}

popsicle
.request({
  url: url + pkg.name,
  body,
  method: 'PUT',
  headers: {
    'Accept': 'application/json'
  }
})
.use(popsicle.plugins.parse('json'))
.then(res => {
  if (res.status === 200) {
    console.log(`${pkg.name} updated to ${pkg.version}!`)
  } else {
    console.log(`Error updating ${pkg.name}:`, res.body)
  }
})
.catch(err => {
  console.log(`Error updating ${pkg.name}:`, err)
})

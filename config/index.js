'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const args = process.argv
const appVersion = require('../package.json').version

module.exports = {
  build: {
    env: require('./prod.env'),
    index: args.includes('local')
      ? path.resolve(__dirname, '../dist-client/index.html')
      : path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: args.includes('local')
      ? path.resolve(__dirname, '../dist-client')
      : path.resolve(__dirname, '../dist'),
    serverRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: args.includes('local')
      ? `http://localhost:9195/page-builder/${appVersion}/`
      : `/page-builder/`,
    productionSourceMap: args.includes('local'),
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

var webpack = require('webpack')
var utils = require('./utils')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

var webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: './src/entry-server.js'
  },
  target: 'node',
  devtool: 'sourcemap',
  output: {
    path: config.build.serverRoot,
    filename: utils.assetsPath('../[name].js'),
    libraryTarget: 'commonjs2'
  },
  // externals: nodeExternals({
  //   whitelist: Object.keys(pkg.dependencies)
  // }),
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new VueSSRServerPlugin()
  ]
})

module.exports = webpackConfig

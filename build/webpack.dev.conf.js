var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// var templates = utils.getNamesInFolder('./src/templates/', '.html')
var modulesFolders = utils.getModulesEntry('./src/pages')
console.log(modulesFolders);

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
})

// var entries = utils.getNamesInFolder('./src/entries/', '.js')
// generate html with same name entries' js injected
// for (var key in templates) {
//     // https://github.com/ampedandwired/html-webpack-plugin
//     console.log('html name: ' + key);
//     module.exports.plugins.push(new HtmlWebpackPlugin({
//         filename: key + '.html',
//         template: templates[key],
//         inject: true,
//         favicon: config.dev.faviconPath,
//         chunks: [key]
//     }))
// }

for (var key in modulesFolders) {
    // https://github.com/ampedandwired/html-webpack-plugin
    console.log('folder name: ' + key);
    module.exports.plugins.push(new HtmlWebpackPlugin({
        filename: key + '.html',
        template: modulesFolders[key] + '/' + key + '.html',
        inject: true,
        favicon: config.dev.faviconPath,
        chunks: [key]
    }))
}

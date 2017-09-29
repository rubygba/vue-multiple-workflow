var path = require('path')
var fs = require('fs')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function(_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
    options = options || {}

    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        var loaders = [cssLoader]
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
    var output = [],
        loaders = exports.cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}

exports.contains = function(arr, obj) {
    console.log('test:', obj)
    var i = arr.length
    while (i--) {
        console.log('arr:', arr[i])
        if (arr[i] === obj) {
            return true
        }
    }
    return false
}

// 获取路径下文件名
exports.getNamesInFolder = function(entryPath, extName) {
    var entries = {}

    // TODO: 未做匹配，只要是文件都会读入，bug可能。扩展名不要变
    fs.readdirSync(entryPath).forEach((item) => {
        // entries[path.basename(item, '.js')] = path.join(entryPath, item)
        entries[path.basename(item, extName)] = entryPath + item
    })
    return entries
}

// 根据modules目录下文件夹名生成
exports.getModulesEntry = function(modulesDir) {
    var dirs = {}

    fs.readdirSync(modulesDir).forEach(item => {
        if (fs.statSync(modulesDir + '/' + item).isDirectory()) {
            dirs[item] = modulesDir + '/' + item
        }
    })
    return dirs
}

exports.getEntries = function(modulesDir) {
    var entries = {}

    fs.readdirSync(modulesDir).forEach(item => {
        if (fs.statSync(modulesDir + '/' + item).isDirectory()) {
            var tempJs = modulesDir + '/' + item + '/' + item + '.js'
            var tempHtml = modulesDir + '/' + item + '/' + item + '.html'
            try {
                fs.accessSync(tempJs)
                fs.accessSync(tempHtml)
            } catch (e) {
                console.log(e)
                tempJs = false
            }
            
            if (tempJs) {
                entries[item] = tempJs
            }
        }
    })
    return entries
}
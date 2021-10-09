'use strict'

process.env.BABEL_ENV = 'worker'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

let workerConfig = {
    entry: {
        worker: path.join(__dirname, '../src/main/child/child.js')
    },
    externals: [
        ...Object.keys(dependencies || {})
    ],
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    node: {
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
    output: {
        filename: 'child.js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist/electron')
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json']
    },
    target: 'node'
}

/**
 * Adjust workerConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
    workerConfig.plugins.push(
        new webpack.DefinePlugin({
            '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
        })
    )
}

/**
 * Adjust workerConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
    workerConfig.plugins.push(
        new BabiliWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    )
}

module.exports = workerConfig
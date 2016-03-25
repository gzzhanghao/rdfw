'use strict'

const webpack = require('webpack')

const babel = {
  compact: true,
  plugins: [
    'check-es2015-constants',
    'transform-es2015-destructuring',
    'transform-es2015-parameters',
    'transform-es2015-modules-commonjs'
  ]
}

module.exports = {
  entry: './src',
  output: {
    path: 'dist',
    filename: 'rdfw.js',
    library: 'rdfw',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', query: babel }
    ]
  },
  devtool: '#sourcemap'
}
